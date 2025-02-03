import Principal "mo:base/Principal";
import Nat32 "mo:base/Nat32";
import Nat64 "mo:base/Nat64";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Result "mo:base/Result";
import Buffer "mo:base/Buffer";
import Types "../type/Types";
import Error "mo:base/Error";
import Iter "mo:base/Iter";
import Utils "../utils/Utils";
import HashMap "mo:base/HashMap";

module {
    public func getReviewsByMovieId(reviews : Types.Reviews, movieId : Text) : [Types.Review] {
        let filteredReviews = HashMap.mapFilter<Text, Types.Review, Types.Review>(
            reviews,
            Text.equal,
            Text.hash,
            func (key : Text, review : Types.Review) : ?Types.Review {
                if (review.movieId == movieId) {
                    ?review; // Include the review if it matches the movieId
                } else {
                    null; // Exclude the review if it doesn't match
                }
            }
        );

        // Convert the filtered HashMap values to an array
        let matchingReviews = Iter.toArray(filteredReviews.vals());
        // Return the filtered reviews
        matchingReviews;
    };

    public func addReview(reviews : Types.Reviews, principalId : Text, movieId : Text, comment : Text, spoiler : ?Char) : Types.Review {
        let id = Utils.generateUUID();
        
        let isSpoiler : Bool = switch (spoiler) {
            case (?'1') { true };  
            case (?'0') { false }; 
            case (_) { false };  
        };

        let newReview : Types.Review = {
            id = id;
            principalId = principalId;
            movieId = movieId;
            comment = comment;
            upVote = [];
            downVote = [];
            date = Time.now()/1000000;
            isSpoiler = isSpoiler; 
        };

        reviews.put(id, newReview);
        return newReview;
    };

    public func toggleUpvote(reviews : Types.Reviews, principalId : Text, reviewId : Text) : Result.Result<Types.Review, Text> {
        switch (reviews.get(reviewId)) {
            case null {
                #err("Review not found");
            };
            case (?review) {
                // Check if user has already voted
                let hasVoted = Array.find<Text>(review.upVote, func(id) { id == principalId });
                switch (hasVoted) {
                    case (?_) {
                        var newUpvote : [Text] = [];

                        for(id in review.upVote.vals()) {
                            if (id != principalId) {
                                newUpvote := Array.append<Text>(newUpvote, [id]);
                            }
                        };

                        let newReview : Types.Review = {
                            id = review.id;
                            principalId = review.principalId;
                            movieId = review.movieId;
                            comment = review.comment;
                            upVote = newUpvote;
                            downVote = review.downVote;
                            date = review.date;
                            isSpoiler = review.isSpoiler;
                        };

                        reviews.put(reviewId, newReview);

                        return #ok(newReview);
                    };
                    case null {
                        let newReview : Types.Review = {
                            id = review.id;
                            principalId = review.principalId;
                            movieId = review.movieId;
                            comment = review.comment;
                            upVote = Array.append<Text>(review.upVote, [principalId]); // Add user to upvotes
                            downVote = review.downVote;
                            date = review.date;
                            isSpoiler = review.isSpoiler;
                        };
                        reviews.put(reviewId, newReview);
                        return #ok(newReview);
                    };
                };
            };
        };
    };

    public func toggleDownvote(reviews : Types.Reviews, principalId : Text, reviewId : Text) : Result.Result<Types.Review, Text> {
        switch (reviews.get(reviewId)) {
            case null {
                #err("Review not found");
            };
            case (?review) {
                // Check if user has already voted
                let hasVoted = Array.find<Text>(review.downVote, func(id) { id == principalId });
                switch (hasVoted) {
                    case (?_) {
                        var newDownvote : [Text] = [];

                        for(id in review.downVote.vals()) {
                            if (id != principalId) {
                                newDownvote := Array.append<Text>(newDownvote, [id]);
                            }
                        };

                        let newReview : Types.Review = {
                            id = review.id;
                            principalId = review.principalId;
                            movieId = review.movieId;
                            comment = review.comment;
                            upVote = review.upVote;
                            downVote = newDownvote;
                            date = review.date;
                            isSpoiler = review.isSpoiler;
                        };
                        reviews.put(reviewId, newReview);
                        return #ok(newReview);
                    };
                    case null {
                        let newReview : Types.Review = {
                            id = review.id;
                            principalId = review.principalId;
                            movieId = review.movieId;
                            comment = review.comment;
                            upVote = review.upVote;
                            downVote = Array.append<Text>(review.downVote, [principalId]); // Add user to downvotes
                            date = review.date;
                            isSpoiler = review.isSpoiler;
                        };
                        reviews.put(reviewId, newReview);
                        return #ok(newReview);
                    };
                };
            };
        };
    };

    
}
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
}
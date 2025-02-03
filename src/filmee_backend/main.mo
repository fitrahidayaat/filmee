import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Result "mo:base/Result";
import Iter "mo:base/Iter";
import Blob "mo:base/Blob";
import Cycles "mo:base/ExperimentalCycles";
import IC "ic:aaaaa-aa";

import Types "type/Types";
import UserService "service/UserService";
import Movies "data/Movies";
import Utils "utils/Utils";
import MovieService "service/MovieService";
import ReviewService "service/ReviewService";

actor {
    private var users : Types.Users = HashMap.HashMap(0, Text.equal, Text.hash);
    private var movies : Types.Movies = HashMap.HashMap(0, Text.equal, Text.hash);
    private var reviews : Types.Reviews = HashMap.HashMap(0, Text.equal, Text.hash);
    private var userBalances : Types.UserBalances = HashMap.HashMap(0, Text.equal, Text.hash);

    public shared func authenticateUser(username : Text, principalId : Text) : async Result.Result<Types.User, Text> {
        return UserService.authenticateUser(users, userBalances, principalId, username);
    };

    // UPDATE USER PROFILE
    public shared func updateUserProfile(principalId : Text, updateData : Types.UserUpdateData) : async Result.Result<Types.User, Text> {
        return UserService.updateUserProfile(users, principalId, updateData);
    };

    // GET USERS
    public query func getUsers() : async [Types.User] {
        return Iter.toArray(users.vals());
    };

    // GET USER BY ID
    public query func getUserById(principalId : Text) : async ?Types.User {
        return users.get(principalId);
    };

    // GET ACCOUNT BALANCE
    public shared func getAccountBalance(principalId : Text) : async Nat {
        return UserService.getAccountBalance(userBalances, principalId);
    };

    public shared func topUpBalance(principalId : Text, amount : Nat) : async ?Types.UserBalance {
        return UserService.topUpBalance(userBalances, principalId, amount);
    };

    public shared func purchasePremium(principalId : Text, tier : Text) : async Text {
        return UserService.purchasePremium(users, userBalances, principalId, tier);
    };

    public func getBookmarks(principalId : Text) : async [Types.Movie] {
        return UserService.getBookmarks(users, principalId);
    };

    public func toggleBookmark(principalId : Text, movieId : Text) : async [Types.Movie] {
        return UserService.toggleBookmark(users, movies, principalId, movieId);
    };

    public func addHistory(principalId: Text, title : Text) : async [Text] {
        return UserService.addHistory(users, principalId, title);
    };

    // MOVIE
    public func seedMovies() : async Text {
        return MovieService.seedMovies(movies, Movies.movieData);
    };

    public func clearMovies() : async Text {
        movies := HashMap.HashMap(0, Text.equal, Text.hash);
        return "Movies have been cleared!";
    };

    public func getAllMovies(n : Nat) : async [Types.Movie] {
        let allMovies = Iter.toArray(movies.vals());
    
        let topNMovies = Array.take(allMovies, n);
        
        return topNMovies;
    };

    public shared query func getMovieById(id : Text) : async ?Types.Movie {
        return movies.get(id);
    };

    public shared query func searchMovieByTitle(keyword : Text, page : Nat, pageSize : Nat) : async [Types.Movie] {
        return MovieService.searchMovieByTitle(movies, keyword, page, pageSize);
    };

    public shared query func searchMovieByGenre(genre : Text, page : Nat, pageSize : Nat) : async [Types.Movie] {
        return MovieService.searchMovieByGenre(movies, genre, page, pageSize);
    };

    public shared query func searchMovieByTitleUsingFilter(keyword : Text, genre : [Text], minRating : Float, page : Nat, pageSize : Nat) : async [Types.Movie] {
        return MovieService.searchMovieByTitleUsingFilter(movies, keyword, genre, minRating, page, pageSize);
    };

    public func spoilerDetection(text : Text) : async Text {
        let url = "https://filmee-ai-843239670484.asia-southeast2.run.app/spoiler-detection"; 
        let request_body_json : Text = "{ \"text\" : \"" # text # "\" }";
        await http_request(url, request_body_json);
    };

    public func getRecommendation(title : Text, top_n : Nat) : async Text {
        let url = "https://filmee-ai-843239670484.asia-southeast2.run.app/recommend"; 
        let request_body_json : Text = "{ \"title\" : \"" # title # "\", \"top_n\" : \"" # Nat.toText(top_n) # " \"}";
        await http_request(url, request_body_json);
    };

    public func getRecommendationUser(principalId : Text, top_n : Nat) : async Text {
        let url = "https://filmee-ai-843239670484.asia-southeast2.run.app/recommend-user"; 
        var request_body_json : Text = "{ \"titles\" : [";
        switch(users.get(principalId)) {
            case(?user) { 
                let titles = user.histories;
                for(i in Iter.range(0, titles.size() - 1)) {
                    request_body_json := request_body_json # "\"" # titles[i] # "\"";
                    if(i != titles.size() - 1) {
                        request_body_json := request_body_json # ",";
                    };
                };

                request_body_json := request_body_json # "], \"top_n\" : \"" # Nat.toText(top_n) # " \"}";

                await http_request(url, request_body_json);
             };
            case(null) { 
                "User Not Found"
            };
        };

    };

    // REVIEW
    public func getReviewsByMovieId(movieId : Text) : async [Types.Review] {
        return ReviewService.getReviewsByMovieId(reviews, movieId);
    };

    public func addReview(principalId : Text, movieId : Text, comment : Text) : async Types.Review {
        let response = await spoilerDetection(comment);
        let spoiler = await Utils.getCharAtIndex(response, 14);
        return ReviewService.addReview(reviews, principalId, movieId, comment, spoiler);
    };

    public func toggleUpvote(principalId : Text, reviewId : Text) : async Result.Result<Types.Review, Text> {
        return ReviewService.toggleUpvote(reviews, principalId, reviewId);
    };

    public func toggleDownvote(principalId : Text, reviewId : Text) : async Result.Result<Types.Review, Text> {
        return ReviewService.toggleDownvote(reviews, principalId, reviewId);
    };

    // UTILS
    public shared query func transform({
        context : Blob;
        response : IC.http_request_result;
    }) : async IC.http_request_result {
        {
            response with headers = []; // not intersted in the headers
        };
    };

    public func http_request(url : Text, request_body_json : Text) : async Text {
        let idempotency_key : Text = Utils.generateUUID();
        let request_headers = [
            { name = "User-Agent"; value = "http_post_sample" },
            { name = "Content-Type"; value = "application/json" },
            { name = "Idempotency-Key"; value = idempotency_key },
        ];

        let request_body = Text.encodeUtf8(request_body_json);

        let http_request : IC.http_request_args = {
            url = url;
            max_response_bytes = null;
            headers = request_headers;
            body = ?request_body;
            method = #post;
            transform = ?{
                function = transform;
                context = Blob.fromArray([]);
            };
        };

        Cycles.add<system>(230_850_258_000);

        let http_response : IC.http_request_result = await IC.http_request(http_request);

        let decoded_text : Text = switch (Text.decodeUtf8(http_response.body)) {
            case (null) { "No value returned" };
            case (?y) { y };
        };

        let result : Text = decoded_text;
        result;
    };
};
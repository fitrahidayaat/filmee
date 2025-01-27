import Int "mo:base/Int";
import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Bool "mo:base/Bool";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Result "mo:base/Result";
import Iter "mo:base/Iter";
import Char "mo:base/Char";
import Time "mo:base/Time";
import Blob "mo:base/Blob";
import Error "mo:base/Error";
import Cycles "mo:base/ExperimentalCycles"; // Import the Cycles module
import IC "ic:aaaaa-aa";

import ledger "canister:icp_ledger_canister";

import Types "type/Types";
import UserService "service/UserService";
import Movies "data/Movies";

actor {
    private var users : Types.Users = HashMap.HashMap(0, Text.equal, Text.hash);
    private var movies : Types.Movies = HashMap.HashMap(0, Text.equal, Text.hash);
    private var Reviews : Types.Reviews = HashMap.HashMap(0, Text.equal, Text.hash);
    private var userBalances : Types.UserBalances = HashMap.HashMap(0, Text.equal, Text.hash);
    
    public query func greet(name : Text) : async Text {
        return "Hello, " # name # "!";
    };
    

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
        switch (userBalances.get(principalId)) {
            case (?userBalance) { 
                return userBalance.balance; // Access balance if it exists
            };
            case null {
                return 0; // Return 0 (or some default value) if no balance exists
            };
        };
    };

    public shared func topUpBalance(principalId : Text, amount : Nat) : async ?Types.UserBalance {
        return UserService.topUpBalance(userBalances, principalId, amount);
    };

    public shared func purchasePremium(principalId : Text, tier : Text) : async Text {
        return UserService.purchasePremium(users, userBalances, principalId, tier);
    };


    // MOVIE
    public func seedMovie() : async Text {
        for(i in Iter.range(0, Movies.movieData.size() - 1)) {
            movies.put(Movies.movieData[i].id, Movies.movieData[i]);
        };
        return "OK";
    };

    public func clearMovies() : async Text {
        movies := HashMap.HashMap(0, Text.equal, Text.hash);
        return "Movies have been cleared!";
    };

    public func getMovies(n : Nat) : async [Types.Movie] {
        let allMovies = Iter.toArray(movies.vals());
    
        // Take the first `n` movies
        let topNMovies = Array.take(allMovies, n);
        
        return topNMovies;
    };

    public shared query func getMovieById(id : Text) : async Result.Result<Types.Movie, Text> {
        switch (movies.get(id)) {
            case (?movie) {
                #ok(movie);
            };
            case null {
                #err("Movie not found");
            };
        };
    };

    private func toLower(text : Text) : Text {
        Text.map(text, func(c : Char) : Char {
            if (Char.isUppercase(c)) {
                Char.fromNat32(Char.toNat32(c) + 32); // Convert uppercase to lowercase
            } else {
                c; // Leave lowercase and other characters unchanged
            }
        });
    };

    // Search movies by keyword in title
    public shared query func searchMovies(keyword : Text) : async [Types.Movie] {
        let allMovies = Iter.toArray(movies.vals());
        let lowerKeyword = toLower(keyword);
        let filteredMovies = Iter.toArray(
            Iter.filter(
                allMovies.vals(),
                func(movie : Types.Movie) : Bool {
                    Text.contains(toLower(movie.title), #text lowerKeyword);
                },
            )
        );
        filteredMovies;
    };

    func generateUUID() : Text {
        let timestamp = Time.now();
        let seconds = timestamp / 1_000_000_000;
        return "UUID-" # Int.toText(seconds);
    };

    //function to transform the response
    public query func transform({
        context : Blob;
        response : IC.http_request_result;
    }) : async IC.http_request_result {
        {
        response with headers = []; // not intersted in the headers
        };
    };

    //PULIC METHOD
    //This method sends a POST request to a URL with a free API we can test.
    public func spoilerDetection(text : Text) : async Text {

        //1. SETUP ARGUMENTS FOR HTTP GET request

        // 1.1 Setup the URL and its query parameters
        let host : Text = "filmee-ai-843239670484.asia-southeast2.run.app";
        let url = "https://filmee-ai-843239670484.asia-southeast2.run.app/spoiler-detection"; 

        // 1.2 prepare headers for the system http_request call

        //idempotency keys should be unique so we create a function that generates them.
        let idempotency_key : Text = generateUUID();
        let request_headers = [
            { name = "User-Agent"; value = "http_post_sample" },
            { name = "Content-Type"; value = "application/json" },
            { name = "Idempotency-Key"; value = idempotency_key },
        ];

        // The request body is a Blob, so we do the following:
        // 1. Write a JSON string
        // 2. Convert Text into a Blob
        let request_body_json : Text = "{ \"text\" : \"" # text # "\" }";
        let request_body = Text.encodeUtf8(request_body_json);

        // 1.3 The HTTP request
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

        //2. ADD CYCLES TO PAY FOR HTTP REQUEST
        Cycles.add<system>(230_850_258_000);

        //3. MAKE HTTPS REQUEST AND WAIT FOR RESPONSE
        let http_response : IC.http_request_result = await IC.http_request(http_request);

        let decoded_text : Text = switch (Text.decodeUtf8(http_response.body)) {
            case (null) { "No value returned" };
            case (?y) { y };
        };

        //4. RETURN RESPONSE OF THE BODY
        let result : Text = decoded_text;
        result;
    };

    public func getRecommendation(title : Text, top_n : Nat) : async Text {

        //1. SETUP ARGUMENTS FOR HTTP GET request

        // 1.1 Setup the URL and its query parameters
        let host : Text = "filmee-ai-843239670484.asia-southeast2.run.app";
        let url = "https://filmee-ai-843239670484.asia-southeast2.run.app/recommend"; 

        // 1.2 prepare headers for the system http_request call

        //idempotency keys should be unique so we create a function that generates them.
        let idempotency_key : Text = generateUUID();
        let request_headers = [
            { name = "User-Agent"; value = "http_post_sample" },
            { name = "Content-Type"; value = "application/json" },
            { name = "Idempotency-Key"; value = idempotency_key },
        ];

        // The request body is a Blob, so we do the following:
        // 1. Write a JSON string
        // 2. Convert Text into a Blob
        let request_body_json : Text = "{ \"title\" : \"" # title # "\", \"top_n\" : \"" # Nat.toText(top_n) # " \"}";
        let request_body = Text.encodeUtf8(request_body_json);

        // 1.3 The HTTP request
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

        //2. ADD CYCLES TO PAY FOR HTTP REQUEST
        Cycles.add<system>(230_850_258_000);

        //3. MAKE HTTPS REQUEST AND WAIT FOR RESPONSE
        let http_response : IC.http_request_result = await IC.http_request(http_request);

        let decoded_text : Text = switch (Text.decodeUtf8(http_response.body)) {
            case (null) { "No value returned" };
            case (?y) { y };
        };

        //4. RETURN RESPONSE OF THE BODY
        let result : Text = decoded_text;
        result;
    };
};
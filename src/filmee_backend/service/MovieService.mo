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

module {
    public func seedMovies(movies: Types.Movies, moviesData : [Types.Movie]) : Text{
        for(i in Iter.range(0, moviesData.size() - 1)) {
            movies.put(moviesData[i].id, moviesData[i]);
        };
        return "OK";
    };

    public func searchMovieByTitle(movies : Types.Movies, keyword : Text, page : Nat, pageSize : Nat) : [Types.Movie] {
        let lowerKeyword = Utils.toLower(keyword); // Convert keyword to lowercase for case-insensitive comparison
        let startIndex = page * pageSize;
        let endIndex = startIndex + pageSize;

        // Efficient filtering and pagination in one pass
        var result : [Types.Movie] = [];
        var count : Nat = 0; // Initialize the count variable

        // Iterate over all movies, filtering and slicing in one pass
        var movieIterator = movies.vals(); // Get the iterator over the movies

        while (count < endIndex) {
            switch (movieIterator.next()) {
                case (?movie) {
                    // Check if the movie title contains the keyword (case-insensitive)
                    if (Text.contains(Utils.toLower(movie.title), #text lowerKeyword)) {
                        if (count >= startIndex and count < endIndex) {
                            result := Array.append(result, [movie]); // Add the movie to the result
                        };
                        count += 1;
                    }
                };
                case (null) {
                    count += 1;   
                }
            }
        };

        result;
    };

    public func searchMovieByGenre(movies : Types.Movies, genre : Text, page : Nat, pageSize : Nat) : [Types.Movie] {
        let lowerGenre = Utils.toLower(genre); // Convert the input genre to lowercase for case-insensitive comparison
        let startIndex = page * pageSize;
        let endIndex = startIndex + pageSize;

        // Efficient filtering and pagination in one pass
        var result : [Types.Movie] = [];
        var count : Nat = 0; // Initialize the count variable

        // Iterate over all movies, filtering and slicing in one pass
        var movieIterator = movies.vals(); // Get the iterator over the movies

        while (count < endIndex) {
            switch (movieIterator.next()) {
                case (?movie) {
                    // Check if any genre matches the input genre (case-insensitive)
                    if (arrayAny(movie.genre, func(g : Text) : Bool {
                        Utils.toLower(g) == lowerGenre;
                    })) {
                        if (count >= startIndex and count < endIndex) {
                            result := Array.append(result, [movie]); // Add the movie to the result
                        };
                        count += 1;
                    }
                };
                case (null) {
                    count += 1;   
                }
            }
        };

        result;
    };

    public func searchMovieByTitleUsingFilter(movies : Types.Movies, keyword : Text, genre : [Text], minRating : Float, page : Nat, pageSize : Nat) : [Types.Movie]{
        let lowerKeyword = Utils.toLower(keyword); // Convert the keyword to lowercase for case-insensitive comparison
        let lowerGenres = Array.map(genre, func(g : Text) : Text { Utils.toLower(g) }); // Convert genres to lowercase

        let startIndex = page * pageSize;
        let endIndex = startIndex + pageSize;

        // Efficient filtering and pagination in one pass
        var result : [Types.Movie] = [];
        var count : Nat = 0; // Initialize the count variable

        // Iterate over all movies, applying the filters and pagination in one pass
        var movieIterator = movies.vals(); // Get the iterator over the movies

        while (count < endIndex) {
            switch (movieIterator.next()) {
                case (?movie) {
                    let movieTitleLower = Utils.toLower(movie.title); // Convert movie title to lowercase
                    let movieRating = movie.vote_average;
                    var existGenre = true;
                    for(genre in lowerGenres.vals()) {
                        var ada = false;
                        for(movieGenre in movie.genre.vals()) {
                            if(genre == Utils.toLower(movieGenre)) {
                                ada := true;
                            }
                        };
                        existGenre := existGenre and ada;
                    };

                    // Check if the title contains the keyword, rating is greater than or equal to minRating,
                    // and the movie's genre matches at least one of the specified genres
                    if (
                        Text.contains(movieTitleLower, #text lowerKeyword) and
                        movieRating >= minRating and
                        existGenre
                    ) {
                        if (count >= startIndex and count < endIndex) {
                            result := Array.append(result, [movie]); // Add the movie to the result
                        };
                        count += 1;
                    }
                };
                case (null) {
                    count += 1;
                }
            }
        };

        result;
    };

    // Custom helper function to check if any element in the array matches the condition
    func arrayAny<T>(array : [T], predicate : T -> Bool) : Bool {
        for (element in array.vals()) {
            if (predicate(element)) {
                return true;
            }
        };
        false;
    };
}
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

    public func searchMovies(movies : Types.Movies, keyword : Text) : [Types.Movie] {
        let allMovies = Iter.toArray(movies.vals());
        let lowerKeyword = Utils.toLower(keyword);
        let filteredMovies = Iter.toArray(
            Iter.filter(
                allMovies.vals(),
                func(movie : Types.Movie) : Bool {
                    Text.contains(Utils.toLower(movie.title), #text lowerKeyword);
                },
            )
        );
        filteredMovies;
    }
}
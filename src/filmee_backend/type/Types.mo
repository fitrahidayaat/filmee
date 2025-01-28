import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Bool "mo:base/Bool";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Float "mo:base/Float";


import ledger "canister:icp_ledger_canister";

module {
    public type Users = HashMap.HashMap<Text, User>;
    public type Movies = HashMap.HashMap<Text, Movie>;
    public type Reviews = HashMap.HashMap<Text, Review>;
    public type UserBalances = HashMap.HashMap<Text, UserBalance>;
    public type Histories = HashMap.HashMap<Text, History>;

    public type User = {
        id : Text;
        username : Text;
        tier : Text;
        profilePic : ?Text;
        tierValidUntil : Int;

        bookmark : [Movie];
    };

    public type UserBalance = {
        id : Text;
        balance : Nat;
    };

    public type UserUpdateData = {
        username : ?Text;
        profilePic : ?Text;
    };

    public type Movie = {
        id : Text;
        release_date : Text;
        title : Text;
        overview : Text;
        popularity : Float;
        vote_count : Nat;
        vote_average : Float;
        original_language : Text;
        genre : [Text];
        poster_url : Text;
    };

    public type Review = {
        id : Text;
        principalId : Text;
        movieId : Text;
        comment : Text;
        upVote : [Text];
        downVote : [Text];
        date : Int;
        isSpoiler : Bool;
    };

    public type History = {
        movieHistories : [Text];
    };
    
}
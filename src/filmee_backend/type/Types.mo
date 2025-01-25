import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Bool "mo:base/Bool";
import Nat "mo:base/Nat";
import Text "mo:base/Text";

module {
    public type Users = HashMap.HashMap<Principal, User>;
    public type Movies = HashMap.HashMap<Text, Movie>;
    public type Reviews = HashMap.HashMap<Text, Review>;
    public type UserBalances = HashMap.HashMap<Principal, UserBalance>;

    public type User = {
        id : Principal;
        username : Text;
        isPremium : Bool;
        profilePic : ?Text;
        depositAddress : Text;

        bookmark : [Principal];
    };

    public type UserBalance = {
        id : Principal;
        balance : Nat;
    };

    public type UserUpdateData = {
        username : ?Text;
        profilePic : ?Text;
    };

    public type Movie = {
        id : Text;
    };

    public type Review = {
        id : Text;
    };
}
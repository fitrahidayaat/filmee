import Int "mo:base/Int";
import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Bool "mo:base/Bool";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Result "mo:base/Result";
import Iter "mo:base/Iter";

import Types "type/Types";
import UserService "service/UserService";

actor {
    private var users : Types.Users = HashMap.HashMap(0, Principal.equal, Principal.hash);
    private var movies : Types.Movies = HashMap.HashMap(0, Text.equal, Text.hash);
    private var Reviews : Types.Reviews = HashMap.HashMap(0, Text.equal, Text.hash);
    private var userBalances : Types.UserBalances = HashMap.HashMap(0, Principal.equal, Principal.hash);

    // public query func greet(name : Text) : async Text {
    //     return "Hello, " # name # "!";
    // };


    public shared func authenticateUser(username : Text, depositAddress : Text, principalId : Text) : async Result.Result<Types.User, Text> {
        return UserService.authenticateUser(users, principalId, depositAddress, username);
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
        return users.get(Principal.fromText(principalId));
    };

    // GET ACCOUNT BALANCE
    public shared func getAccountBalance(principalId : Text) : async Nat {
        return await UserService.getAccountBalance(principalId);
    }

    // public query func topUpBalance(principalId: Principal, nominal : Nat) : async Result.Result<Types.User, Text> {
    //     return UserService.topUpBalance(users, principalId, nominal);
    // };

    // public query func premiumPurchase(principalId: Principal) : async Result.Result<Types.User, Text> {
    //     return UserService.premiumPurchase(users, principalId);

    // };
};

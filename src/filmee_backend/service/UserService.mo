import Principal "mo:base/Principal";
import Nat32 "mo:base/Nat32";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Result "mo:base/Result";
import Buffer "mo:base/Buffer";
import Types "../type/Types";

import ledger "canister:icp_ledger_canister";

module {
    public func authenticateUser(
        users : Types.Users,
        principalId : Text,
        depositAddress : Text,
        username : Text,
    ) : Result.Result<Types.User, Text> {
        // Input validation
        let principal = Principal.fromText(principalId);
        if (Text.size(username) < 3 or Text.size(username) > 20) {
            return #err("Username must be between 3 and 20 characters");
        };

        // Check if principal is valid
        if (Principal.isAnonymous(principal)) {
            return #err("Anonymous principals are not allowed");
        };

        // Check if username already exists
        for ((id, user) in users.entries()) {
            if (Text.equal(user.username, username)) {
                // If the username matches but belongs to a different user, throw an error
                if (id != principal) {
                    return #err("USERNAME_TAKEN: The username '" # username # "' is already in use.");
                };
            };
        };

        switch(users.get(principal)) {
            // If user exists, return their data
            case (?existingUser) {
                #ok(existingUser);
            };

            case null {
                let newUser : Types.User = {
                    id = principal;
                    username = username;
                    isPremium = false;
                    depositAddress = depositAddress;
                    bookmark = [];
                    profilePic = null;
                };

                // Add new user to the hashmap
                users.put(principal, newUser);

                #ok(newUser);
            }
        }
    };

    public func updateUserProfile(
        users : Types.Users,
        principalId : Text,
        updateData : Types.UserUpdateData,
    ) : Result.Result<Types.User, Text> {
        let principal = Principal.fromText(principalId);
        if (Principal.isAnonymous(principal)) {
            return #err("Anonymous principals are not allowed");
        };

        switch(users.get(principal)) {
            case (null) {
                return #err("User not found!");
            };
            case (?user) {
                let username = switch (updateData.username) {
                    case (null) { user.username };
                    case (?newUsername) {
                        if (Text.size(newUsername) < 3 or Text.size(newUsername) > 20) {
                            return #err("Username must be between 3 and 20 characters");
                        };

                        if (newUsername != user.username) {
                        for ((id, existingUser) in users.entries()) {
                            if (id != principal and Text.equal(existingUser.username, newUsername)) {
                                return #err("USERNAME_TAKEN: The username '" # newUsername # "' is already in use.");
                            };
                        };
                        };
                        newUsername;
                    };
                };

                let profilePic = switch (updateData.profilePic) {
                    case (null) { user.profilePic };
                    case (?newProfilePic) { ?newProfilePic };
                };

                let updatedUser : Types.User = {
                    id = user.id;
                    isPremium = user.isPremium;
                    bookmark = user.bookmark;
                    depositAddress = user.depositAddress;

                    // UPDATE FIELD
                    username = username;
                    profilePic = profilePic;
                };

                users.put(principal, updatedUser);
                #ok(updatedUser);
            }
        }
    };

    // GET ICP BALANCE
    public func getAccountBalance(principalId : Text) : async Nat {
        let principal = Principal.fromText(principalId);
        let balance = await ledger.icrc1_balance_of({
            owner = principal;
            subaccount = null;
        });
        return balance;
    };

    // GET CREDIT BALANCE
    public func getCreditBalance(userBalances : Types.UserBalances, userId : Principal) : Types.UserBalance {
        switch (userBalances.get(userId)) {
            case (null) {
                { balance = 0; id = userId };
            };
            case (?balance) { balance };
        };
    };

    // public func topUpBalance(users: Types.Users ,principalId : Principal, nominal : Nat) : Result.Result<Types.User, Text> {
        
    // };

    // public func premiumPurchase(users: Types.Users, principalId : Principal) : Result.Result<Types.User, Text> {

    // };
}
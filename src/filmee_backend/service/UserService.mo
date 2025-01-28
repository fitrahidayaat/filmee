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
import Nat "mo:base/Nat";

import ledger "canister:icp_ledger_canister";

module {
    public func authenticateUser(
        users : Types.Users,
        userBalances : Types.UserBalances,
        principalId : Text,
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
                if (id != principalId) {
                    return #err("USERNAME_TAKEN: The username '" # username # "' is already in use.");
                };
            };
        };

        switch(users.get(principalId)) {
            // If user exists, return their data
            case (?existingUser) {
                #ok(existingUser);
            };

            case null {
                let newUser : Types.User = {
                    id = principalId;
                    username = username;
                    tier = "free";
                    bookmark = [];
                    profilePic = null;
                    tierValidUntil = Time.now();
                };

                let newUserBalance : Types.UserBalance = {
                    id = principalId;
                    balance = 0;
                };

                // Add new user to the hashmap
                users.put(principalId, newUser);
                userBalances.put(principalId, newUserBalance);
                #ok(newUser);
            }
        };
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

        switch(users.get(principalId)) {
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
                            if (id != principalId and Text.equal(existingUser.username, newUsername)) {
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
                    tier = user.tier;
                    bookmark = user.bookmark;
                    tierValidUntil = user.tierValidUntil;

                    // UPDATE FIELD
                    username = username;
                    profilePic = profilePic;
                };

                users.put(principalId, updatedUser);
                #ok(updatedUser);
            }
        }
    };

    public func topUpBalance(userBalances : Types.UserBalances, principalId : Text, amount : Nat) : ?Types.UserBalance {
        switch (userBalances.get(principalId)) {
            case (?userBalance) {
                // If the user balance exists, update the balance
                let updatedBalance = {
                    id = userBalance.id;
                    balance = userBalance.balance + amount;
                };
                userBalances.put(principalId, updatedBalance);
                return ?updatedBalance; // Return the updated balance
            };
            case null {
                // Handle case where no balance exists for the given principalId
                let newBalance = {
                    id = principalId;
                    balance = amount; // Initialize balance with the amount
                };
                userBalances.put(principalId, newBalance);
                return ?newBalance; // Return the new balance
            };
        };
    };

    public func purchasePremium(users : Types.Users, userBalances : Types.UserBalances, principalId : Text, tier : Text) : Text {
        switch (userBalances.get(principalId)) {
            case (?userBalance) {
                if (tier == "tier1") {
                    if(userBalance.balance < 20) {
                        return "Issuficient Balance";
                    } else {
                        let updatedBalance = {
                            id = principalId;
                            balance : Nat = userBalance.balance - 20;
                        };
                        userBalances.put(principalId, updatedBalance);
                        
                        switch (users.get(principalId)) {
                            case (?user) {

                                let updatedUser : Types.User = {
                                    id = user.id;
                                    tier = "tier1";
                                    bookmark = user.bookmark;
                                    username = user.username;
                                    profilePic = user.profilePic;
                                    tierValidUntil = user.tierValidUntil + 30 * 24 * 60 * 60 * 1000;
                                };
                                users.put(principalId, updatedUser);
                            };
                            case null {
                                return "User Not Found"
                            }
                        };
                        return "OK";
                    }
                } else if(tier == "tier2") {
                    if(userBalance.balance < 40) {

                        return "Issuficient Balance";
                    } else {
                        let newBalance = {
                            id = principalId;
                            balance : Nat = userBalance.balance - 40;
                        };
                        userBalances.put(principalId, newBalance);

                        switch (users.get(principalId)) {
                            case (?user) {
                                let updatedUser : Types.User = {
                                    id = user.id;
                                    tier = "tier2";
                                    bookmark = user.bookmark;
                                    username = user.username;
                                    profilePic = user.profilePic;
                                    tierValidUntil = user.tierValidUntil + 30 * 24 * 60 * 60 * 1000;
                                };
                                users.put(principalId, updatedUser);
                            };
                            case null {
                                return "User Not Found"
                            }
                        };
                        return "OK";
                    }
                } else {
                    return "OK";
                }
            };
            case null {
                return "User Not Found";
            }
        }
    };

    public func getAccountBalance(userBalances : Types.UserBalances, principalId : Text) : Nat{
        switch (userBalances.get(principalId)) {
            case (?userBalance) { 
                return userBalance.balance; // Access balance if it exists
            };
            case null {
                return 0; // Return 0 (or some default value) if no balance exists
            };
        };
    }

}
import Text "mo:base/Text";
import Char "mo:base/Char";
import IC "ic:aaaaa-aa";
import Time "mo:base/Time";
import Int "mo:base/Int";
import Cycles "mo:base/ExperimentalCycles";
import Blob "mo:base/Blob";

module {
    public func toLower(text : Text) : Text {
        Text.map(text, func(c : Char) : Char {
            if (Char.isUppercase(c)) {
                Char.fromNat32(Char.toNat32(c) + 32); // Convert uppercase to lowercase
            } else {
                c; // Leave lowercase and other characters unchanged
            }
        });
    };

    public func generateUUID() : Text {
        let timestamp = Time.now();
        let seconds = timestamp / 1_000_000_000;
        return "UUID-" # Int.toText(seconds);
    };

    public func getCharAtIndex(input : Text, index : Nat) : async ?Char {
        // Convert the string to an array of characters
        let chars = Text.toArray(input);

        // Check if the index is within bounds
        if (index < chars.size()) {
            ?chars[index]; // Return the character at the specified index
        } else {
            null; // Return null if the index is out of bounds
        }
    };
};
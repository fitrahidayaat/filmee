# `Filmee`

🎬 Filmee is your go-to platform for discovering with your favorite movies. Filmee helps users find new films, bookmark their favorites, write reviews, and even receive AI-driven recommendations.

![alt text](./src/filmee_frontend/public/landing.png)

## Why Filmee?

1. 🎭 Personalized Experience – Get movie recommendations tailored to your taste.
2. 🔖 Bookmark – Save movies to your watchlist and never forget what you wanted to see.
3. 📝 User Reviews – Share your thoughts and engage with a community of film lovers.
4. 🤖 AI-Powered Recommendations – Discover movies based on your viewing history.
5. 🚨 Spoiler Detection – Stay spoiler-free with our advanced detection system.
6. 🎞 Multi-Genre Search – Find the perfect movie based on your favorite genres and ratings.

## Features

### User Management

* Authenticate User – Securely sign in and manage user profiles.
* Update Profile – Modify usernames and profile pictures.
* Account Balance – Check and top-up balances for premium features.
* Premium Subscription – Upgrade to premium tiers for exclusive benefits.

### Movie Discovery

* Search by Title & Genre – Explore films using filters like keywords, genre, and ratings.
* AI-Based Recommendations – Get movie suggestions on your history and preferences.

### Watchlist & History

* Bookmark Movies – Save movies for later viewing.
* View Watch History – Keep track of the movies you've watched.

### Community Reviews & Engagement

* Write Reviews – Share opinions and feedback on movies.
* Upvote/Downvote Reviews – Engage with the community by voting on reviews.
* Spoiler Detection – Keep reviews spoiler-free with our intelligent detection system.

### AI-Powered Features

* Movie Recommendations – Get movie suggestions.
* User-Specific Recommendations – AI-generated recommendations tailored for each user.
* Spoiler Detection – Automatic analysis to flag potential spoilers in reviews.

## Team members
* Alvaro Muyassar
* Muhammad Gleam Mulyawan
* Muhammad Ramdhan Fitra Hidayat
* Nabil Hafiyyan Zihni
* Rahmi Anisa

### 🎬 Video Demonstration : https://youtu.be/m_nTvW_tgBE

## Get Started
To get started, you might want to explore the project directory structure and the default configuration file. Working with this project in your development environment will not affect any production deployment or identity tokens.

To learn more before you start working with `filmee`, see the following documentation available online:

- [Quick Start](https://internetcomputer.org/docs/current/developer-docs/setup/deploy-locally)
- [SDK Developer Tools](https://internetcomputer.org/docs/current/developer-docs/setup/install)
- [Motoko Programming Language Guide](https://internetcomputer.org/docs/current/motoko/main/motoko)
- [Motoko Language Quick Reference](https://internetcomputer.org/docs/current/motoko/main/language-manual)

If you want to start working on your project right away, you might want to try the following commands:

```bash
cd filmee/
dfx help
dfx canister --help
```

## Running the project locally

If you want to test your project locally, you can use the following commands:

```bash
# Starts the replica, running in the background
dfx start --background

# Deploys your canisters to the replica and generates your candid interface
dfx deploy
```

Once the job completes, your application will be available at `http://localhost:4943?canisterId={asset_canister_id}`.

If you have made changes to your backend canister, you can generate a new candid interface with

```bash
npm run generate
```

at any time. This is recommended before starting the frontend development server, and will be run automatically any time you run `dfx deploy`.

If you are making frontend changes, you can start a development server with

```bash
npm start
```

Which will start a server at `http://localhost:3000`, proxying API requests to the replica at port 4943.


# Backend Documentation
## Users
### authenticateUser
```bash
authenticateUser(username : Text, principalId : Text)
```
example usage
```bash
authenticateUser("Samsul", "aaaa-aa");
```
example return
```
{
  id = "aaaa-aa";
  tierValidUntil = 1_738_145_388_487;
  username = "Samsul";
  bookmark = [];
  tier = "free";
  histories = [];
  profilePic = null;
}
```

### updateUserProfile
```bash
updateUserProfile(principalId : Text, updateData : Types.UserUpdateData)
```
example usage
```bash
updateUserProfile(principal.toText(), {
    "username" : ["samsul"],
    "profilePic" : ["blobFile"]
});
```

### getUserById
```bash
getUserById(principalId : Text)
```
example usage
```bash
getUserById("aaaa-aa")
```
example return
```
{
  id = "aaaa-aa";
  tierValidUntil = 1_738_145_388_487;
  username = "Samsul";
  bookmark = [];
  tier = "free";
  histories = [];
  profilePic = null;
}
```

### getAccountBalance
```bash
getAccountBalance(principalId : Text)
```
example usage
```bash
getAccountBalance("aaaa-aa")
```
example return
```
20
```

### topUpBalance
```bash
topUpBalance(principalId : Text, amount : Nat)
```
example usage
```bash
topUpBalance("aaaa-aa", 20)
```
example return
```
{
  id = "aaaa-aa";
  balance = 20;
}
```

### purchasePremium
```bash
purchasePremium(principalId : Text, tier : Text)
```
example usage
```bash
topUpBalance("aaaa-aa", "tier1")
```
example return
```
"OK"
```

### getBookmarks
```
getBookmarks(principalId : Text)
```
example usage
```bash
getBookmarks("aaaa-aa", "tier1")
```
example return
```
[
  {
    id = "1";
    title = "";
    vote_average = 8.3;
    release_date = "2021-12-15";
    overview = "";
    poster_url = "";
    original_language = "";
    genre = ["Action", "Adventure", "Science Fiction"];
    vote_count = 8_940;
    popularity = 5083.954;
  }
]
```

### addBookmark
```
addBookmark(principalId : Text, movieId : Text)
```
example usage
```bash
addBookmark("aaaa-aa", "2")
```
example return
```
[
  {
    id = "1";
    title = "";
    vote_average = 8.3;
    release_date = "2021-12-15";
    overview = "";
    poster_url = "";
    original_language = "";
    genre = ["Action", "Adventure", "Science Fiction"];
    vote_count = 8_940;
    popularity = 5083.954;
  },
  {
    id = "2";
    title = "";
    vote_average = 8.3;
    release_date = "2021-12-15";
    overview = "";
    poster_url = "";
    original_language = "";
    genre = ["Action", "Adventure", "Science Fiction"];
    vote_count = 8_940;
    popularity = 5083.954;
  }
]
```

### addHistory
```
addHistory(principalId: Text, title : Text)
```
example usage
```
addHistory("aaaa-aa", "Spider-Man")
```
example return
```
["Spider-Man"]
```

## Movies
### getMovieById
```
getMovieById(id : Text)
```
example usage
```
getMovieById("1")
```
example return
```
{
  id = "1";
  title = "";
  vote_average = 8.3;
  release_date = "2021-12-15";
  overview = "";
  poster_url = "";
  original_language = "";
  genre = ["Action", "Adventure", "Science Fiction"];
  vote_count = 8_940;
  popularity = 5083.954;
}
```

### searchMovieByTitle
```
searchMovieByTitle(keyword : Text, page : Nat, pageSize : Nat)
```
example usage
```
searchMovieByTitle("spider", 0, 1)
```
example return
```
[
  {
    id = "133";
    title = "The Amazing Spider-Man 2";
    vote_average = 6.5 : float64;
    release_date = "2014-04-16";
    overview = "For Peter Parker, life is busy. Between taking out the bad guys as Spider-Man and spending time with the person he loves, Gwen Stacy, high school graduation cannot come quickly enough. Peter has not forgotten about the promise he made to Gwen’s father to protect her by staying away, but that is a promise he cannot keep. Things will change for Peter when a new villain, Electro, emerges, an old friend, Harry Osborn, returns, and Peter uncovers new clues about his past.";
    poster_url = "https://image.tmdb.org/t/p/original/c3e9e18SSlvFd1cQaGmUj5tqL5P.jpg";
    original_language = "en";
    genre = vec { "Action"; "Adventure"; "Fantasy" };
    vote_count = 10_763 : nat;
    popularity = 231.441 : float64;
  }
]
```

### searchMovieByGenre
```
searchMovieByGenre(genre : Text, page : Nat, pageSize : Nat)
```
example usage
```
searchMovieByGenre("Adventure", 0, 1)
```
example return
```
[
  {
    id = "4660";
    title = "Pokémon: Zoroark - Master of Illusions";
    vote_average = 6.6 : float64;
    release_date = "2010-07-10";
    overview = "Ash and his friends must stop a greedy media mogul from using the shape-shifting Zoroark to capture the time-travelling Celebi.";
    poster_url = "https://image.tmdb.org/t/p/original/tWgH64RZmm2rIHtO2DNnfN3DZa8.jpg";
    original_language = "ja";
    genre = vec { "Family"; "Animation"; "Adventure"; "Fantasy" };
    vote_count = 152 : nat;
    popularity = 22.079 : float64;
  }
]

```

### searchMovieByTitleUsingFilter
```
searchMovieByTitleUsingFilter(keyword : Text, genre : [Text], minRating : Float, page : Nat, pageSize : Nat)
```
example usage
```
searchMovieByTitleUsingFilter("Spider", ["Adventure"], 6.2, 0, 1)
```
example return
```
[
  {
    id = "133";
    title = "The Amazing Spider-Man 2";
    vote_average = 6.5 : float64;
    release_date = "2014-04-16";
    overview = "For Peter Parker, life is busy. Between taking out the bad guys as Spider-Man and spending time with the person he loves, Gwen Stacy, high school graduation cannot come quickly enough. Peter has not forgotten about the promise he made to Gwen’s father to protect her by staying away, but that is a promise he cannot keep. Things will change for Peter when a new villain, Electro, emerges, an old friend, Harry Osborn, returns, and Peter uncovers new clues about his past.";
    poster_url = "https://image.tmdb.org/t/p/original/c3e9e18SSlvFd1cQaGmUj5tqL5P.jpg";
    original_language = "en";
    genre = vec { "Action"; "Adventure"; "Fantasy" };
    vote_count = 10_763 : nat;
    popularity = 231.441 : float64;
  }
]
```

### spoilerDetection
```
spoilerDetection(text : Text) 
```
example usage
```
spoilerDetection("Main character died at episode 7") 
```
example return
```
'{"prediction":1}'
```

### getRecommendation
```
getRecommendation(title : Text, top_n : Nat)
```
example usage
```
getRecommendation("Spider-Man", 2)
```
example return
```
{
  "recommendations": [
    {
      "Title": "Spider-Man: Into the Spider-Verse",
      "Overview": "Miles Morales is juggling his life between being a high school student and being a spider-man. When Wilson \"Kingpin\" Fisk uses a super collider, others from across the Spider-Verse are transported to this dimension.",
      "Genre": "Action, Adventure, Animation, Science Fiction",
      "Poster_Url": "https://image.tmdb.org/t/p/original/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg",
      "Similarity_Score": 0.45469761478876514
    },
    {
      "Title": "Spider-Man 3",
      "Overview": "The seemingly invincible Spider-Man goes up against an all-new crop of villains—including the shape-shifting Sandman. While Spider-Man’s superpowers are altered by an alien organism, his alter ego, Peter Parker, deals with nemesis Eddie Brock and also gets caught up in a love triangle.",
      "Genre": "Fantasy, Action, Adventure",
      "Poster_Url": "https://image.tmdb.org/t/p/original/qFmwhVUoUSXjkKRmca5yGDEXBIj.jpg",
      "Similarity_Score": 0.4513363830639984
    }
  ]
}
```

### getRecommendationUser(principalId : Text, top_n : Nat)
```
getRecommendationUser(principalId : Text, top_n : Nat)
```
example usage
```
getRecommendationUser("aaaa-aa", 2)
```
example return
```
{
  "recommendations": [
    {
      "Title": "Spider-Man: Into the Spider-Verse",
      "Overview": "Miles Morales is juggling his life between being a high school student and being a spider-man. When Wilson \"Kingpin\" Fisk uses a super collider, others from across the Spider-Verse are transported to this dimension.",
      "Genre": "Action, Adventure, Animation, Science Fiction",
      "Poster_Url": "https://image.tmdb.org/t/p/original/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg",
      "Similarity_Score": 0.45469761478876514
    },
    {
      "Title": "Spider-Man 3",
      "Overview": "The seemingly invincible Spider-Man goes up against an all-new crop of villains—including the shape-shifting Sandman. While Spider-Man’s superpowers are altered by an alien organism, his alter ego, Peter Parker, deals with nemesis Eddie Brock and also gets caught up in a love triangle.",
      "Genre": "Fantasy, Action, Adventure",
      "Poster_Url": "https://image.tmdb.org/t/p/original/qFmwhVUoUSXjkKRmca5yGDEXBIj.jpg",
      "Similarity_Score": 0.4513363830639984
    }
  ]
}
```

## Review
### addReview
```
addReview(principalId : Text, movieId : Text, comment : Text)
```
example usage
```
addReview("aaaa-aa", "1", "Very good movie")
```
example return
```
{
  id = "UUID-1738148033";
  date = 1_738_148_033_946 : int;
  movieId = "1";
  upVote = vec {};
  comment = "Very good movie";
  downVote = vec {};
  isSpoiler = false;
  principalId = "aaaa-aa";
}
```

### getReviewsByMovieId
```
getReviewsByMovieId(movieId : Text)
```
example usage
```
getReviewsByMovieId("1")
```
example return
```
{
  id = "UUID-1738148033";
  date = 1_738_148_033_946 : int;
  movieId = "1";
  upVote = vec {};
  comment = "Very good movie";
  downVote = vec {};
  isSpoiler = false;
  principalId = "aaaa-aa";
}
```

### toggleUpvote
```
toggleUpvote(principalId : Text, reviewId : Text)
```
example usage
```
toggleUpvote("aaaa-aa", "UUID-1738148033")
```
example return
```
{
  ok = record {
    id = "UUID-1738148033";
    date = 1_738_148_033_946 : int;
    movieId = "1";
    upVote = vec {
      "aaaa-aa";
    };
    comment = "Very good movie";
    downVote = vec {};
    isSpoiler = false;
    principalId = "aaaa-aa";
  }
}
```

### toggleDownvote
```
toggleDownvote(principalId : Text, reviewId : Text)
```
example usage
```
toggleDownvote("aaaa-aa", "UUID-1738148033")
```
example return
```
{
  ok = record {
    id = "UUID-1738148033";
    date = 1_738_148_033_946 : int;
    movieId = "1";
    upVote = vec {
      "aaaa-aa";
    };
    comment = "Very good movie";
    downVote = vec {
      "aaaa-aa";
    };
    isSpoiler = false;
    principalId = "aaaa-aa";
  }
}
```

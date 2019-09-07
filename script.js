(function() {
    var nextUrl, hasReachedBottom;
    var resultsHtml,
        displayHtml,
        imageUrl,
        buttonHtml,
        userInput,
        albumOrArtist = "";
    var resultsText = $("#results-text");
    var displayResults = $("#results-container");
    var moreButton = $(".more-button");
    var url = "https://elegant-croissant.glitch.me/spotify";
    var useInfiniteScroll = "?scroll=infinite";

    $(".search-button").on("click", function() {
        getNewResults();
    });

    $("input").on("keydown", function(event) {
        if (event.which === 13) {
            getNewResults();
        }
    });

    function getNewResults() {
        userInput = $('input[name="user-input"]').val();
        console.log("userInput: ", userInput);
        albumOrArtist = $(".artist-or-album").val();
        console.log("albumOrArtist: ", albumOrArtist);
        resultsHtml = "";
        displayHtml = "";
        displayResults.html(displayHtml);
        $.ajax({
            url: url,
            data: {
                query: userInput,
                type: albumOrArtist
            },
            success: function(response) {
                response = response.artists || response.albums;
                console.log("response: ", response);
                console.log("response.items: ", response.items);
                getResultsHtml(response);
                getNextUrl(response);
                if (useInfiniteScroll == location.search) {
                    checkScrollPosition();
                }
            }
        });
    }

    $(document).on("click", moreButton, function() {
        $(displayResults).remove(".more-button-container");
        $.ajax({
            url: nextUrl,
            data: {
                query: userInput,
                type: albumOrArtist
            },
            success: function(response) {
                response = response.artists || response.albums;
                getResultsHtml(response);
                getNextUrl(response);
            }
        });
    });

    function getResultsHtml(response) {
        if (response.items.length == 0) {
            resultsHtml =
                "There are no results that match your search. Please try again.";
            resultsText.text(resultsHtml);
        } else {
            resultsHtml = response.total + " results for '" + userInput + "':";
            resultsText.text(resultsHtml);
            var i = 0;
            for (i = 0; i < response.items.length; i++) {
                if (response.items.length >= 20) {
                    buttonHtml =
                        '<div class="more-button-container hide"><button class="more-button hide">Show more results</button></div>';
                }

                if (response.items[i].images.length === 0) {
                    imageUrl =
                        "https://developer.spotify.com/assets/branding-guidelines/icon2@2x.png";
                } else {
                    imageUrl = response.items[i].images[0].url;
                }

                var artistUrl = response.items[i].external_urls.spotify;
                var artistAlbumName = response.items[i].name;
                displayHtml +=
                    '<div class="one-of-twenty-container"><div class="results-albums-artists"><a href="' +
                    artistUrl +
                    '"><img src="' +
                    imageUrl +
                    '"></a></div><div class="results-name"><a href="' +
                    artistUrl +
                    '">' +
                    artistAlbumName +
                    "</a></div></div>";
            }

            displayResults.html(displayHtml);
            if (i == 20 && !useInfiniteScroll == location.search) {
                displayResults.append(buttonHtml);
            }
            console.log("buttonHtml: ", buttonHtml);
        }
    }

    function getNextUrl(response) {
        console.log("response in getNextUrl:", response);
        nextUrl =
            response.next &&
            response.next.replace("https://api.spotify.com/v1/search", url);
        console.log("response.next after replace: ", response.next);
        console.log("nextUrl inside getNextUrl:", nextUrl);
    }

    function checkScrollPosition() {
        hasReachedBottom =
            $(document).scrollTop() + $(window).height() >=
            $(document).height() - 100;
        if (hasReachedBottom) {
            $.ajax({
                url: nextUrl,
                data: {
                    query: userInput,
                    type: albumOrArtist
                },
                success: function(response) {
                    response = response.artists || response.albums;
                    getResultsHtml(response);
                    getNextUrl(response);
                    checkScrollPosition();
                }
            });
        } else {
            setTimeout(checkScrollPosition, 1000);
        }
    }
})();

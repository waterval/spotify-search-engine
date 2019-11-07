(function() {
    var searchResultsText,
        foundMusicHtml,
        moreResultsUrl,
        userInput,
        albumOrArtist = "";
    var firstResultsUrl = "https://elegant-croissant.glitch.me/spotify";
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
        albumOrArtist = $(".artist-or-album").val();
        searchResultsText = "";
        foundMusicHtml = "";
        moreResultsUrl = "";
        $("#results-container").html(foundMusicHtml);
        ajaxRequest();
    }

    function ajaxRequest() {
        $.ajax({
            url: moreResultsUrl || firstResultsUrl,
            data: {
                query: userInput,
                type: albumOrArtist
            },
            success: function(response) {
                response = response.artists || response.albums;
                getResultsHtml(response);
                getNextUrl(response);
                if (useInfiniteScroll == location.search) {
                    checkScrollPosition();
                }
            }
        });
    }

    function getResultsHtml(response) {
        var imageUrl,
            buttonHtml = "";
        if (response.items.length == 0) {
            searchResultsText =
                "There are no results that match your search. Please try again with another search query.";
            $("#results-text").text(searchResultsText);
        } else {
            searchResultsText =
                response.total + " results for '" + userInput + "':";
            $("#results-text").text(searchResultsText);
            var i = 0;
            for (i = 0; i < response.items.length; i++) {
                if (response.items.length >= 20) {
                    buttonHtml =
                        '<div class="more-button-container"><button class="more-button">Show more results</button></div>';
                }

                if (response.items[i].images.length === 0) {
                    imageUrl =
                        "https://developer.spotify.com/assets/branding-guidelines/icon2@2x.png";
                } else {
                    imageUrl = response.items[i].images[0].url;
                }

                var artistUrl = response.items[i].external_urls.spotify;
                var artistAlbumName = response.items[i].name;
                foundMusicHtml +=
                    '<div class="one-of-twenty-container"><div class="results-albums-artists"><a href="' +
                    artistUrl +
                    '" target="_blank"><img src="' +
                    imageUrl +
                    '"></a></div><div class="results-name"><a href="' +
                    artistUrl +
                    '" target="_blank">' +
                    artistAlbumName +
                    "</a></div></div>";
            }
            $("#results-container").html(foundMusicHtml);
            if (i == 20 && !useInfiniteScroll == location.search) {
                $("#results-container").append(buttonHtml);
            }
        }
    }

    function getNextUrl(response) {
        moreResultsUrl =
            response.next &&
            response.next.replace(
                "https://api.spotify.com/v1/search",
                firstResultsUrl
            );
    }

    function checkScrollPosition() {
        var hasReachedBottom =
            $(document).scrollTop() + $(window).height() >=
            $(document).height() - 100;
        if (hasReachedBottom) {
            ajaxRequest();
        } else {
            setTimeout(checkScrollPosition, 1000);
        }
    }

    $(document).on("click", ".more-button", function() {
        $("#results-container").remove(".more-button-container");
        ajaxRequest();
    });
})();

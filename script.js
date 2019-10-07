(function() {
    var nextUrl, hasReachedBottom;
    var resultsHtml,
        displayHtml,
        userInput,
        albumOrArtist = "";
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
        albumOrArtist = $(".artist-or-album").val();
        resultsHtml = "";
        displayHtml = "";
        $("#results-container").html(displayHtml);
        $.ajax({
            url: url,
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

    $(document).on("click", $(".more-button"), function() {
        $("#results-container").remove(".more-button-container");
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
        let imageUrl,
            buttonHtml = "";

        if (response.items.length == 0) {
            resultsHtml =
                "There are no results that match your search. Please try again.";
            $("#results-text").text(resultsHtml);
        } else {
            resultsHtml = response.total + " results for '" + userInput + "':";
            $("#results-text").text(resultsHtml);
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

            $("#results-container").html(displayHtml);
            if (i == 20 && !useInfiniteScroll == location.search) {
                $("#results-container").append(buttonHtml);
            }
        }
    }

    function getNextUrl(response) {
        nextUrl =
            response.next &&
            response.next.replace("https://api.spotify.com/v1/search", url);
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

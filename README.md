# Spotify Search Engine

Spotify Search Engine allows users to find music on the Spotify platform. They can choose between artists and albums. After clicking on their favorite album or an artist, the corresponding page on Spotify opens.

## Preview

<p align="center">
<img src="/public/spotify-search-engine-preview.png" alt="Preview of Spotify Search Engine">
</p>

## Features

-   Search options for artists and albums
-   Message with the amount of results
-   Music including links to the corresponding Spotify pages
-   Up to 20 results are shown and, if available, more music can be loaded
-   Automatically load more music on downward scrolling by adding '?scroll=infinite' to the url

## Technology

-   HTML
-   CSS
-   JavaScript
-   jQuery
-   Spotify API

## Code Example

```
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
```

## Local usage

Download all files and open the index.html file in your browser.

## Credits

The idea for this project came from David Friedman from Spiced Academy.

## Contribute

Contribution is much appreciated. Please let me know about any bugs and ideas for improvements.

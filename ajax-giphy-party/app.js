const $gifDisplay = $('#gif-display');
const $gifSearch = $('#search-input');

function gif(res) {
    let allResults = res.data.length;
    if (allResults) {
        let randomRes = Math.floor(Math.random() * allResults);
        let $newRow = $("<div>")
        let $newGif = $("<img>", {
            src: res.data[randomRes].images.original.url
        });
        $newRow.append($newGif);
        $gifDisplay.append($newRow)
     }
    }

   

$("form").on("submit", async function(e) {
    e.preventDefault();
    
    let searchInput = $gifSearch.val();
    $gifSearch.val('');
    const response = await axios.get('http://api.giphy.com/v1/gifs/search', {
        params: {
            q: searchInput,
            api_key: "MhAodEJIJxQMxW9XqxKjyXfNYdLoOIym"
        }
    });
    gif(response.data)
})

$('#remove').on('click', function() {
    $gifDisplay.empty()
})



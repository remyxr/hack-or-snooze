// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

const API_URL = 'http://jservice.io/api/';

// categories is the main data structure for the app
let categories = [];

/** Get NUM_CATEGORIES random category IDs from API.
 *
 * Returns an array of category IDs
 */
async function getCategoryIds() {
    try {
        const response = await axios.get(`${API_URL}categories?count=100`);
        const data = response.data;
        const categoryIds = data.map(category => category.id);
        return categoryIds;
    } catch (error) {
        console.log('Error:', error);
    }
}

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */
async function getCategory(catId) {
    try {
        const response = await axios.get(`${API_URL}category?id=${catId}`);
        const data = response.data;
        const category = {
            title: data.title,
            clues: data.clues.map(clue => ({
                question: clue.question,
                answer: clue.answer,
                showing: null,
            })),
        };
        return category;
    } catch (error) {
        console.log('Error:', error);
    }
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initially, just show a "?" where the question/answer would go.)
 */
function fillTable() {
    const $table = $('#jeopardyTable');
    $table.empty();

    const $thead = $('<thead>');
    const $headerRow = $('<tr>');

    categories.forEach(category => {
        const $th = $('<th>').text(category.title);
        $headerRow.append($th);
    });

    $thead.append($headerRow);
    $table.append($thead);

    const $tbody = $('<tbody>');

    for (let i = 0; i < 5; i++) {
        const $row = $('<tr>');

        categories.forEach(category => {
            const $td = $('<td>').addClass('blocked');
            const $questionMark = $('<span>').addClass('question-mark').text('?');
            $td.append($questionMark);
            $td.on('click', handleClick);
            $row.append($td);
        });

        $tbody.append($row);
    }

    $table.append($tbody);
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 */
function handleClick() {
    const $cell = $(this);
    const column = $cell.index();
    const row = $cell.parent().index();
    const clue = categories[column].clues[row];

    if (clue.showing === null) {
        $cell.empty().text(clue.question);
        clue.showing = 'question';
    } else if (clue.showing === 'question') {
        $cell.text(clue.answer);
        clue.showing = 'answer';
    }
}

/** Wipe the current Jeopardy board and reset the categories. */
function resetGame() {
    categories = [];
    fillTable();
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 */
async function setupAndStart() {
    const categoryIds = await getCategoryIds();
    const randomCategoryIds = _.sampleSize(categoryIds, 6);
    categories = [];

    for (const catId of randomCategoryIds) {
        const category = await getCategory(catId);
        categories.push(category);
    }

    fillTable();
}

/** On click of start / restart button, reset the game. */
$('#newGameButton').click(function () {
    resetGame();
    setupAndStart();
});

/** On page load, set up the game. */
$(document).ready(function () {
    setupAndStart();
});

import formatTodosForAI from "./formatTodosForAI";

const fetchSuggestion = async (board: Board) => {
    const todos = formatTodosForAI(board);

    const res = await fetch("/api/generateSummary", {
        method: "POST",
        body: JSON.stringify({ todos }),
        headers: {
            "Content-Type": "application/json"
        }
    })

    const GPTdata = await res.json();
    const { content } = GPTdata;

    return content;
}

export default fetchSuggestion;
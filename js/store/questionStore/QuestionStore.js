const questionServiceUri = 'http://localhost:5000/api/questions'

class QuestionStore {

    constructor() {
        this.indexOfCurrentQuestion = 0;
        this.currentQuestion = this._fetchQuestionWithId(this.indexOfCurrentQuestion)
            .catch(console.log);
    }

    goToNextQuestion() {
        this.indexOfCurrentQuestion += 1;
        this._fetchQuestionWithId(this.indexOfCurrentQuestion)
            .then(data => this.currentQuestion = data);
        return {};
    }

    getCurrentQuestion() {
        return this.currentQuestion;
    }

    async _fetchQuestionWithId(id) {
        let response = await fetch(questionServiceUri + `/${id}`);
        if (response.ok) {
            return await response.json();
        }
        console.log(response)
        return null;
    }
}
class Store {
    constructor(questionStore, sessionStore) {
        this.sessionStore = sessionStore;
        this.questionStore = questionStore;
    }

    getNextQuestion(){
        let nextQuestion = this.questionStore.getCurrentQuestionAndIncrementCurrentQuestionIndex();
        return {...nextQuestion};
    }

    isInputtedCommandCorrect(command){
        return command===this.questionStore.getCurrentQuestion().answer;
    }

    getCurrentQuestion(){
        return this.questionStore.getCurrentQuestion();
    }

    getBranchesOfSession(){
        return this.sessionStore.getSession().getBranchesOfSession();
    }

    addNewFile(fileName, content){
        this.sessionStore.getSession().getCurrentBranch().addNewFile(fileName,content);
    }

    getAllFiles(){
        return this.sessionStore.getSession().getCurrentBranch().getFiles();
    }
}
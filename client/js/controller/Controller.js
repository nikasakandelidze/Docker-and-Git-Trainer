
class Controller {
    constructor(store, view) {
        this.store = store;
        this.view = view;
        this.terminalCommandEngine=new TerminalCommands(
            (fileName, fileContent)=>{
                this.store.addNewFile(fileName, fileContent);
                this.view.updateFreestyleFilesView(this.store.getAllFiles(), (fileName) => this.store.getContentOfFileWithName(fileName));
            },
            ()=>this.store.getAllFiles(),
            (fileNamesArray) => {
                this.store.stageFileWithName(fileNamesArray);
                this.view.updateFreestyleFilesView(this.store.getAllFiles(), (fileName) => this.store.getContentOfFileWithName(fileName));
            },
            (commitMessage) => {
                this.store.commitStagedFiles(commitMessage);
                this.view.updateFreestyleFilesView(this.store.getAllFiles(), (fileName) => this.store.getContentOfFileWithName(fileName));
                view.updateFreeStyleBranchesView(this.store.getBranchesOfSession());
            },
            (fileName) => {
                let content = this.store.getContentOfFileWithName(fileName);
                this.view.viewFileContent(content, fileName);
            },
            () => {
                let currentBranch=this.store.getCurrentBranch();
                console.log(this.store.getCurrentBranch().getFiles());
                view.listAllFilesInTerminal(currentBranch);
            },
            (branchName)=>{
                this.store.addNewBranchWithName(branchName);
                this.store.checkoutBranchWithName(branchName);
                this.view.updateFreeStyleBranchesView(this.store.getBranchesOfSession());
            },
            (branchName)=>{
                this.store.checkoutBranchWithName(branchName);
            }
        );
        this.initialiseEventListeners();
        this.updateInitialView()
            .then(e=>e);
    }

    initialiseEventListeners() {
        view.initialiseWelcomeWindow();
        view.initialiseNextQuestionButtonListener(()=>this.getNextQuestion());
        view.initialiseSubmitAnswerButtonListener((command)=>this.store.isInputtedCommandCorrect(command), ()=> this.getNextQuestion());
        view.initialiseGetHintButtonListener(()=>this.store.getCurrentQuestion());
        view.initialiseUnblurClickableContainers();
        view.initialiseHintModalWindowCross(()=>this.store.getCurrentQuestion());
        view.initialiseSideMenuButton();
        view.initialiseSideSideMenuFreestyleRouterbutton();
        view.initialiseSideSideMenuTrainerRouterbutton();
        view.updateFreeStyleBranchesView(()=>this.store.getBranchesOfSession())
        view.updateFreestyleFilesView(()=>this.store.getAllFiles(), (fileName) => this.store.getContentOfFileWithName(fileName));
        view.initialiseFreeStyleConsoleInput((input)=>this.terminalCommandEngine.processAppropriateCommand(input));
        view.initaliseFileContentEditorSaveButton( (content, fileName) => this.store.saveContentToFileWithName(content, fileName) );
        view.initialiseFreeStyleInputNavigation();
        view.initialiseListAllQuestionsButton(()=>this.startFetchingQuestions(), ()=>this.stopFetchingQuestion());
        view.makeQuestionSubmitModalWindowListener();
        view.submitNewQuestionButtonInit(question=>this.store.addNewQuestion(question));
    }

    async updateInitialView () {
        let currentQuestion = await this.store.getCurrentQuestion();
        this.view.updateQuestion(currentQuestion.question);
    }

    getNextQuestion() {
        this.store.getNextQuestion()
            .then(currentQuestion => {
                view.updateQuestion(currentQuestion.question);
                view.resetAnswerAndDescriptionToBlur();
                view.makeElementWithIdApear('unblur_answer_container');
                view.makeElementWithIdApear('unblur_description_container');
            })
    }

    startFetchingQuestions(){
        let tempStore = this.store;
        this.questionFetching = setInterval(async ()=>{
            let currentQuestion = await tempStore.getCurrentQuestion();
            tempStore.getNextQuestion();
            view.addQuestionIntoAllQuestionsModal(currentQuestion);
            //todo: stop it whenever needed. JSON excpetion after going through all quesitons.
            //todo: add X button for all question modal window and also improve design of all quesiton button/toggler
        }, 1000);
    }

    stopFetchingQuestion(){
        clearInterval(this.questionFetching)
    }
}


const RESPONSES ={

  "START_GAME":"Okay. Lets begin this game!",
  "WELCOME_MSG":"Welcome to World Play. Are you ready to up your vocabulary game?",
  "GUESS_LETTER_PROMPT":"Please guess the next letter"


}


const words =["areamat","areama","areamt","acid","away","area","arch","ally","axis","avid","aura","alas"]
const letters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
const levels = [1,2,3]






const Alexa = require('ask-sdk');
// i18n library dependency, we use it below in a localisation interceptor
const i18n = require('i18next');
// i18n strings for all supported locales

const LaunchRequestHandler = {
  canHandle(handlerInput) {
      return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
  },
  handle(handlerInput) {
      const speakOutput = RESPONSES.WELCOME_MSG;

      return handlerInput.responseBuilder
          .speak(speakOutput)
          .reprompt(speakOutput)
          .getResponse();
  }
};



const StartGameIntentHandler = {
  canHandle(handlerInput) {
      return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
          && Alexa.getIntentName(handlerInput.requestEnvelope) === 'StartGameIntent';
  },
  handle(handlerInput) {
      let speakOutput = RESPONSES.START_GAME;


      // temporary functions//


      let sessionAttr = handlerInput.attributesManager.getSessionAttributes();


      let currentLetterPosition = 2;
      let currentChance = 0;

      
      //fix the first letter
      let firstLetter = letters[Math.floor(Math.random()*26)]

      //select the list of words TODO : Make API call
      
      let wordsSelected = words
      let currentWord =words[0];

      currentWord ="a"

      for(var i=1;i<words[0].length;i++){

          currentWord+="_";
       
      }

      sessionAttr.wordsSelected = wordsSelected;
      sessionAttr.currentWord = currentWord;
      sessionAttr.currentLetterPosition = currentLetterPosition;
      sessionAttr.currentChance = currentChance;
      sessionAttr.firstLetter = firstLetter;
      sessionAttr.newWordsList = wordsSelected;



      

      handlerInput.attributesManager.setSessionAttributes(sessionAttr);
      speakOutput+=("Your word begins with "+firstLetter+" and is " + currentWord.length + " characters long");



      return handlerInput.responseBuilder
          .speak(speakOutput)
          .reprompt("please guess a letter")
          .getResponse();
  }
};
const GuessLetterIntentHandler = {
  canHandle(handlerInput) {
      return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
          && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GuessLetterIntent';
  },
  handle(handlerInput) {


      let guessedLetter = Alexa.getSlotValue(handlerInput.requestEnvelope,"GuessedLetter");
      guessedLetter=guessedLetter.toLowerCase();

      let speakOutput = ""


      // temporary functions//


      let sessionAttr = handlerInput.attributesManager.getSessionAttributes();
      
      let newWordsList = sessionAttr.newWordsList;
      let wordsSelected = sessionAttr.wordsSelected;
      let currentWord = sessionAttr.currentWord;
      let currentLetterPosition = sessionAttr.currentLetterPosition;

      let tempList = []

      currentWord = currentWord.substring(0,currentLetterPosition-1)+guessedLetter+currentWord.substring(currentLetterPosition,currentWord.length);


      for(var i=0;i<wordsSelected.length;i++){
          if(wordsSelected[i].startsWith(currentWord.substring(0,currentLetterPosition))){

              tempList.push(wordsSelected[i]);
              
          }
      }

      if(tempList.length==0){

          //alexa selects on its own
          let hintWordList =wordsSelected;

          let tempCurrWord = wordsSelected[Math.floor(Math.random()*wordsSelected.length)];

          let tempCurrWordSubstring = tempCurrWord.substring(0,currentLetterPosition);

          for(var i=0;i<wordsSelected.length;i++){
              if(wordsSelected[i].startsWith(tempCurrWordSubstring)){
  
                  hintWordList.push(wordsSelected[i]);

                  
              }
          }

          sessionAttr.wordsSelected =hintWordList

          console.log("Hint words");


          console.log(JSON.stringify(hintWordList));

          speakOutput = `Uh oh! You are going down the wrong path. Should I fill a letter for you ?`





      }

      else{

          sessionAttr.wordsSelected = tempList;
          speakOutput = "That's awesome! Now my chance!"
          speakOutput += ("I fill the letter " + tempList[0][currentLetterPosition]+" for you.")
          currentWord = currentWord.substring(0,currentLetterPosition)+tempList[0][currentLetterPosition]+currentWord.substring(currentLetterPosition+1,currentWord.length);

          sessionAttr.currentWord = currentWord;

          speakOutput +=(" The word now looks like "+currentWord)
      }



      

      
      handlerInput.attributesManager.setSessionAttributes(sessionAttr);
      speakOutput+=("Your word begins with "+wordsSelected[0]+" and is " + wordsSelected[0].length + " characters long");



      return handlerInput.responseBuilder
          .speak(speakOutput)
          .reprompt("please guess a letter")
          .getResponse();
  }
};






const HelpIntentHandler = {
  canHandle(handlerInput) {
      return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
          && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
      const speakOutput = RESPONSES.WELCOME_MSG;

      return handlerInput.responseBuilder
          .speak(speakOutput)
          .reprompt(speakOutput)
          .getResponse();
  }
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
      return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
          && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
              || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
      const speakOutput = RESPONSES.WELCOME_MSG;

      return handlerInput.responseBuilder
          .speak(speakOutput)
          .getResponse();
  }
};
/* *
* FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
* It must also be defined in the language model (if the locale supports it)
* This handler can be safely added but will be ingnored in locales that do not support it yet 
* */
const FallbackIntentHandler = {
  canHandle(handlerInput) {
      return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
          && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
  },
  handle(handlerInput) {
      const speakOutput = RESPONSES.WELCOME_MSG;

      return handlerInput.responseBuilder
          .speak(speakOutput)
          .reprompt(speakOutput)
          .getResponse();
  }
};
/* *
* SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
* session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
* respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
* */
const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
      return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
  },
  handle(handlerInput) {
      console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
      // Any cleanup logic goes here.
      return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
  }
};
/* *
* The intent reflector is used for interaction model testing and debugging.
* It will simply repeat the intent the user said. You can create custom handlers for your intents 
* by defining them above, then also adding them to the request handler chain below 
* */
const IntentReflectorHandler = {
  canHandle(handlerInput) {
      return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
  },
  handle(handlerInput) {
      const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
      const speakOutput = RESPONSES.WELCOME_MSG;

      return handlerInput.responseBuilder
          .speak(speakOutput)
          //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
          .getResponse();
  }
};
/**
* Generic error handling to capture any syntax or routing errors. If you receive an error
* stating the request handler chain is not found, you have not implemented a handler for
* the intent being invoked or included it in the skill builder below 
* */
const ErrorHandler = {
  canHandle() {
      return true;
  },
  handle(handlerInput, error) {

      console.log(`Error handled: ${error.message}`);
      console.log(`Error stack: ${error.stack}`);
      const speakOutput = "Error occured"
      console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

      return handlerInput.responseBuilder
          .speak(speakOutput)
          .reprompt(speakOutput)
          .getResponse();
  }
};

// This request interceptor will bind a translation function 't' to the handlerInput
const LocalisationRequestInterceptor = {
  process(handlerInput) {
      i18n.init({
          lng: Alexa.getLocale(handlerInput.requestEnvelope),
          resources: languageStrings
      }).then((t) => {
          handlerInput.t = (...args) => t(...args);
      });
  }
};
/**
* This handler acts as the entry point for your skill, routing all request and response
* payloads to the handlers above. Make sure any new handlers or interceptors you've
* defined are included below. The order matters - they're processed top to bottom 
* */
exports.handler = Alexa.SkillBuilders.standard()
  .addRequestHandlers(
      LaunchRequestHandler,
      
      StartGameIntentHandler,
      GuessLetterIntentHandler,
      HelpIntentHandler,
      CancelAndStopIntentHandler,
      FallbackIntentHandler,
      SessionEndedRequestHandler,
      IntentReflectorHandler)
  .addErrorHandlers(
      ErrorHandler)
  
  
  .lambda();

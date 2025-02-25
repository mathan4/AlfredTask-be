
const flashcardModel = require('../models/flashcardModel');
const FlashcardModel = require('../models/flashcardModel');

const addNewFlashcard = async (request, response) => {
  try {
    const { question, answer } = request.body;

    const questionRegex = /^[a-zA-Z0-9\s\.,!?]{5,}$/;

    if (!questionRegex.test(question)) {
      return response
        .status(400)
        .send(
          "Invalid question. Must be at least 5 characters and can include alphanumeric characters and punctuation."
        );
    } else {
      const flashcard = { question, answer };
      const NewFlashcard = await FlashcardModel.create(flashcard);
      return response.status(201).json({
        message: "successfully created new flashcard",
        flashcard: NewFlashcard,
      });
    }
  } catch (error) {
    return response.status(500).json({ ErrorMessage: error.message });
  }
};

const getAllFlashCard = async (request, response) => {
  try {
    const flashcards = await FlashcardModel.find();
    return response.status(200).send(flashcards);
  } catch (error) {
    return response.status(500).json({ ErrorMessage: error.message });
  }
};

const getAllDueFlashCard = async (request, response) => {
  const today = new Date();
  
  try {
    const dueFlashCards = await FlashcardModel.find({
      nextReviewDate: { $lte: today },
    });
    if (dueFlashCards.length === 0) {
      return response.status(200).json({ message: "No Flash Card Due" });
    } else {
      return response.status(200).send(dueFlashCards);
    }
  } catch (error) {
    return response.status(500).json({ ErrorMessage: error.message });
  }
};

const updateFlashCard = async (request, response) => {

    const id = request.params.id;
    const { res } = request.body;
    try {
      const flashcard = await FlashcardModel.findById(id);
    
      if (!flashcard) {
        return response.status(404).json({ message: "FlashCard Not Found" });
      }
      const newBox = res ? flashcard.box + 1 : 1;
    
      const intervals = [1, 2, 5, 10];
      const daysToAdd = intervals[newBox - 1] || 30;
    
    
      const nextReviewDate = new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000);
    
      
      const updatedFlashCard = await FlashcardModel.findByIdAndUpdate(
        id,
        {
          $set: {
            box: newBox,
            nextReviewDate: nextReviewDate,
          }
        },
        { new: true } 
      );
    
      console.log("Flashcard updated:", updatedFlashCard);
      return response.status(200).send(updatedFlashCard);
    
    } catch (error) {
      console.error("Error:", error);
      return response.status(500).json({ message: "Internal server error" });
    }
    
};


const deleteFlashCard=async(request,response)=>{
  const id=request.params.id;
  try {
    const flashcard=await FlashcardModel.findByIdAndDelete(id);
    if (!flashcard) {
      return res.status(404).json({ message: 'Flashcard not found' });
    }
    return response.status(200).json({message:"Successfully deleted",flashcard})
    
  } catch (error) {
    return response.status(500).json({ErrorMessage:error.message})

  }
}

module.exports={deleteFlashCard,updateFlashCard,getAllDueFlashCard,getAllFlashCard,addNewFlashcard}

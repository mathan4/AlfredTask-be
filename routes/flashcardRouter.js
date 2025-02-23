const express=require('express')
const router=express.Router()

const{ addNewFlashcard, getAllDueFlashCard, getAllFlashCard, updateFlashCard, deleteFlashCard }=require('../controllers/flashcardController')

router.route('/flashcards').get(getAllDueFlashCard)
router.route('/').get(getAllFlashCard)
router.route('/addflashcards').post(addNewFlashcard)
router.route('/flashcards/:id').post(updateFlashCard)
router.route('/flashcards/:id').delete(deleteFlashCard)

module.exports=router
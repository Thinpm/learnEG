
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import NavBar from '@/components/NavBar';
import { useAuth } from '@/contexts/AuthContext';
import TestQuestion, { QuestionType } from '@/components/TestQuestion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { CheckCircle, RefreshCw, BookMarked, TestTube, ArrowLeft } from 'lucide-react';

// Import the mock vocabulary data from the Vocabulary component
import { vocabularyData } from './Vocabulary';

interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string;
  audio?: string;
}

const Test = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [testCompleted, setTestCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!topicId || !vocabularyData[topicId as keyof typeof vocabularyData]) {
      navigate('/topics');
      return;
    }
    
    const topic = vocabularyData[topicId as keyof typeof vocabularyData];
    
    // Generate questions from vocabulary
    const generatedQuestions: Question[] = [];
    
    // Add multiple choice questions
    topic.forEach((word, idx) => {
      // Create options with the correct answer and random distractors
      const otherWords = topic
        .filter((_, i) => i !== idx)
        .map(w => w.translation)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      
      const options = [...otherWords, word.translation].sort(() => Math.random() - 0.5);
      
      generatedQuestions.push({
        id: `mc-${idx}`,
        type: 'multipleChoice',
        question: `"${word.word}" nghĩa là gì?`,
        options,
        correctAnswer: word.translation,
      });
    });
    
    // Add fill in the blank questions using the example sentences
    topic.forEach((word, idx) => {
      if (word.example) {
        const blankExample = word.example.replace(
          new RegExp(`\\b${word.word}\\b`, 'i'), 
          '________'
        );
        
        generatedQuestions.push({
          id: `fb-${idx}`,
          type: 'fillBlank',
          question: `Điền từ thích hợp vào chỗ trống: ${blankExample}`,
          correctAnswer: word.word,
        });
      }
    });
    
    // Add listen and choose questions
    topic.forEach((word, idx) => {
      // Create options with the correct answer and random distractors
      const otherWords = topic
        .filter((_, i) => i !== idx)
        .map(w => w.word)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      
      const options = [...otherWords, word.word].sort(() => Math.random() - 0.5);
      
      generatedQuestions.push({
        id: `lc-${idx}`,
        type: 'listenChoose',
        question: 'Nghe và chọn từ đúng:',
        options,
        correctAnswer: word.word,
        audio: word.word,
      });
    });
    
    // Shuffle questions and take 10 or fewer if there are less than 10
    const shuffledQuestions = generatedQuestions
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);
    
    setQuestions(shuffledQuestions);
    setScore({ correct: 0, total: shuffledQuestions.length });
  }, [topicId, isAuthenticated, navigate]);
  
  const handleAnswer = (questionId: string, answer: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
    
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = currentQuestion.correctAnswer.toLowerCase() === answer.toLowerCase();
    
    if (isCorrect) {
      toast.success('Chính xác!');
      setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      toast.error('Chưa đúng. Hãy xem lại đáp án.');
    }
    
    // If this is the last question, show the results
    if (currentQuestionIndex === questions.length - 1) {
      setTimeout(() => {
        setTestCompleted(true);
        setShowResults(true);
      }, 1000);
    } else {
      // Move to the next question after a short delay
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
      }, 1500);
    }
  };
  
  const restartTest = () => {
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setTestCompleted(false);
    setShowResults(false);
    
    // Re-shuffle questions
    setQuestions(prev => [...prev].sort(() => Math.random() - 0.5));
    setScore({ correct: 0, total: questions.length });
    
    toast.info('Bắt đầu bài kiểm tra mới.');
  };
  
  const backToVocabulary = () => {
    navigate(`/vocabulary/${topicId}`);
  };
  
  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <NavBar />
        <div className="flex-1 container py-8 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Đang tạo bài kiểm tra...</h2>
          </div>
        </div>
      </div>
    );
  }
  
  const currentQuestion = questions[currentQuestionIndex];
  const progress = (currentQuestionIndex / questions.length) * 100;
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar />
      
      <main className="flex-1 container py-8">
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate(`/vocabulary/${topicId}`)}>
              <ArrowLeft className="mr-1 h-4 w-4" /> Quay lại
            </Button>
            <h1 className="text-2xl font-bold tracking-tight capitalize flex items-center">
              <TestTube className="mr-2 h-6 w-6" />
              Kiểm tra kiến thức: {topicId}
            </h1>
          </div>
          
          <Badge variant="outline" className="py-2">
            Câu hỏi {currentQuestionIndex + 1}/{questions.length}
          </Badge>
        </div>
        
        <div className="max-w-3xl mx-auto mb-6">
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="max-w-3xl mx-auto">
          {!testCompleted && (
            <TestQuestion
              {...currentQuestion}
              userAnswer={userAnswers[currentQuestion.id] || null}
              isAnswered={!!userAnswers[currentQuestion.id]}
              onAnswer={(answer) => handleAnswer(currentQuestion.id, answer)}
            />
          )}
        </div>
      </main>
      
      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center text-xl">
              <CheckCircle className="mr-2 h-6 w-6 text-green-600" />
              Kết quả bài kiểm tra
            </DialogTitle>
            <DialogDescription className="text-center pt-2">
              Bạn đã hoàn thành bài kiểm tra chủ đề {topicId}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6">
            <div className="text-center text-3xl font-bold mb-4">
              {score.correct}/{score.total}
            </div>
            <Progress 
              value={(score.correct / score.total) * 100} 
              className="h-3"
              indicatorClassName={
                score.correct / score.total >= 0.8 
                  ? "bg-green-600" 
                  : score.correct / score.total >= 0.5 
                  ? "bg-yellow-500" 
                  : "bg-red-500"
              }
            />
            <div className="mt-4 text-center text-sm text-muted-foreground">
              {score.correct / score.total >= 0.8 
                ? "Tuyệt vời! Bạn đã nắm vững chủ đề này." 
                : score.correct / score.total >= 0.5 
                ? "Khá tốt! Hãy tiếp tục luyện tập thêm." 
                : "Cần cố gắng hơn! Hãy quay lại học lại chủ đề này."}
            </div>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={restartTest}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Làm lại bài kiểm tra
            </Button>
            <Button 
              className="flex-1"
              onClick={backToVocabulary}
            >
              <BookMarked className="mr-2 h-4 w-4" />
              Quay lại học từ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Test;

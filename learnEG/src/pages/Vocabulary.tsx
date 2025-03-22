import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Volume, Heart, Check, X, RefreshCw, BookMarked, TestTube } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import NavBar from '@/components/NavBar';
import { useAuth } from '@/contexts/AuthContext';

// Export the vocabulary data so it can be used in the Test component
export const vocabularyData = {
  travel: [
    { word: 'Airport', translation: 'Sân bay', example: 'We arrived at the airport early.' },
    { word: 'Baggage', translation: 'Hành lý', example: 'Please check your baggage at the counter.' },
    { word: 'Destination', translation: 'Điểm đến', example: 'Our final destination is Paris.' },
    { word: 'Hotel', translation: 'Khách sạn', example: 'We booked a room at a five-star hotel.' },
    { word: 'Passport', translation: 'Hộ chiếu', example: 'Don\'t forget to bring your passport.' },
  ],
  technology: [
    { word: 'Computer', translation: 'Máy tính', example: 'I need to buy a new computer.' },
    { word: 'Internet', translation: 'Internet', example: 'The internet connection is very fast.' },
    { word: 'Software', translation: 'Phần mềm', example: 'We need to update the software.' },
    { word: 'Hardware', translation: 'Phần cứng', example: 'The hardware needs to be replaced.' },
    { word: 'Password', translation: 'Mật khẩu', example: 'Change your password regularly.' },
  ],
  weather: [
    { word: 'Sunny', translation: 'Nắng', example: 'It\'s a sunny day today.' },
    { word: 'Rainy', translation: 'Mưa', example: 'Bring an umbrella, it\'s rainy.' },
    { word: 'Cloudy', translation: 'Nhiều mây', example: 'The sky is cloudy this morning.' },
    { word: 'Storm', translation: 'Bão', example: 'A big storm is coming this weekend.' },
    { word: 'Temperature', translation: 'Nhiệt độ', example: 'The temperature dropped last night.' },
  ],
  // Add placeholder data for other topics
  food: [
    { word: 'Restaurant', translation: 'Nhà hàng', example: 'Let\'s go to a restaurant for dinner.' },
    { word: 'Delicious', translation: 'Ngon', example: 'The food was delicious.' },
    { word: 'Menu', translation: 'Thực đơn', example: 'Can I see the menu, please?' },
    { word: 'Chef', translation: 'Đầu bếp', example: 'The chef prepared a special meal.' },
    { word: 'Ingredient', translation: 'Nguyên liệu', example: 'What are the main ingredients in this dish?' },
  ],
  music: [
    { word: 'Concert', translation: 'Buổi hòa nhạc', example: 'We attended a concert last night.' },
    { word: 'Singer', translation: 'Ca sĩ', example: 'She is a famous singer.' },
    { word: 'Guitar', translation: 'Đàn guitar', example: 'He plays the guitar very well.' },
    { word: 'Lyrics', translation: 'Lời bài hát', example: 'I love the lyrics of this song.' },
    { word: 'Melody', translation: 'Giai điệu', example: 'The melody is catchy.' },
  ],
  movies: [
    { word: 'Cinema', translation: 'Rạp chiếu phim', example: 'We went to the cinema to watch a movie.' },
    { word: 'Actor', translation: 'Diễn viên', example: 'He is my favorite actor.' },
    { word: 'Director', translation: 'Đạo diễn', example: 'The director won an award for the film.' },
    { word: 'Screenplay', translation: 'Kịch bản', example: 'She wrote the screenplay for the movie.' },
    { word: 'Ticket', translation: 'Vé', example: 'I bought two tickets for the premiere.' },
  ],
  culture: [
    { word: 'Tradition', translation: 'Truyền thống', example: 'We follow many traditions in our family.' },
    { word: 'Festival', translation: 'Lễ hội', example: 'The festival is celebrated every year.' },
    { word: 'Custom', translation: 'Tập quán', example: 'It\'s a custom to give gifts during this holiday.' },
    { word: 'Heritage', translation: 'Di sản', example: 'This building is part of our cultural heritage.' },
    { word: 'Ceremony', translation: 'Nghi lễ', example: 'The ceremony was very formal.' },
  ],
  relationships: [
    { word: 'Friend', translation: 'Bạn bè', example: 'She is my best friend.' },
    { word: 'Family', translation: 'Gia đình', example: 'Family is very important to me.' },
    { word: 'Love', translation: 'Tình yêu', example: 'Love is a beautiful feeling.' },
    { word: 'Trust', translation: 'Sự tin tưởng', example: 'Trust is the foundation of any relationship.' },
    { word: 'Support', translation: 'Sự hỗ trợ', example: 'I appreciate your support.' },
  ],
  education: [
    { word: 'School', translation: 'Trường học', example: 'My school is not far from here.' },
    { word: 'Teacher', translation: 'Giáo viên', example: 'My teacher is very patient.' },
    { word: 'Student', translation: 'Học sinh', example: 'He is a brilliant student.' },
    { word: 'Homework', translation: 'Bài tập về nhà', example: 'I have a lot of homework to do.' },
    { word: 'Exam', translation: 'Kỳ thi', example: 'The final exam is next week.' },
  ],
};

const Vocabulary = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [savedWords, setSavedWords] = useState<string[]>([]);
  const [mastered, setMastered] = useState<string[]>([]);
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewList, setReviewList] = useState<number[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Reset states when topic changes
    setCurrentIndex(0);
    setShowTranslation(false);

    // Load saved words from localStorage
    const savedWordsFromStorage = localStorage.getItem(`savedWords-${topicId}`);
    if (savedWordsFromStorage) {
      setSavedWords(JSON.parse(savedWordsFromStorage));
    }

    // Load mastered words from localStorage
    const masteredFromStorage = localStorage.getItem(`mastered-${topicId}`);
    if (masteredFromStorage) {
      setMastered(JSON.parse(masteredFromStorage));
    }
  }, [topicId, isAuthenticated, navigate]);

  // Save to localStorage when savedWords changes
  useEffect(() => {
    if (topicId) {
      localStorage.setItem(`savedWords-${topicId}`, JSON.stringify(savedWords));
    }
  }, [savedWords, topicId]);

  // Save to localStorage when mastered changes
  useEffect(() => {
    if (topicId) {
      localStorage.setItem(`mastered-${topicId}`, JSON.stringify(mastered));
    }
  }, [mastered, topicId]);

  const startTest = () => {
    navigate(`/test/${topicId}`);
  };

  if (!topicId || !vocabularyData[topicId as keyof typeof vocabularyData]) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <NavBar />
        <div className="flex-1 container py-8 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Chủ đề không tồn tại</h2>
            <Button onClick={() => navigate('/topics')}>Quay lại danh sách chủ đề</Button>
          </div>
        </div>
      </div>
    );
  }

  const vocabulary = vocabularyData[topicId as keyof typeof vocabularyData];
  const currentWord = vocabulary[currentIndex];

  const handleNext = () => {
    if (currentIndex < vocabulary.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowTranslation(false);
    } else {
      // Loop back to the first word
      setCurrentIndex(0);
      setShowTranslation(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowTranslation(false);
    } else {
      // Loop to the last word
      setCurrentIndex(vocabulary.length - 1);
      setShowTranslation(false);
    }
  };

  const toggleSaveWord = () => {
    const wordId = `${topicId}-${currentWord.word}`;
    if (savedWords.includes(wordId)) {
      setSavedWords(savedWords.filter(id => id !== wordId));
      toast.info(`Đã xóa "${currentWord.word}" khỏi danh sách từ đã lưu`);
    } else {
      setSavedWords([...savedWords, wordId]);
      toast.success(`Đã lưu "${currentWord.word}" vào danh sách từ mục`);
    }
  };

  const toggleMastered = () => {
    const wordId = `${topicId}-${currentWord.word}`;
    if (mastered.includes(wordId)) {
      setMastered(mastered.filter(id => id !== wordId));
      toast.info(`Đã xóa "${currentWord.word}" khỏi danh sách từ đã thuộc`);
    } else {
      setMastered([...mastered, wordId]);
      toast.success(`Đã đánh dấu "${currentWord.word}" là đã thuộc`);
    }
  };

  const startReviewMode = () => {
    // Create a list of indices for words that aren't mastered
    const wordsToReview = vocabulary
      .map((_, index) => index)
      .filter(index => !mastered.includes(`${topicId}-${vocabulary[index].word}`));

    if (wordsToReview.length === 0) {
      toast.info("Bạn đã thuộc tất cả các từ trong chủ đề này!");
      return;
    }

    // Shuffle the list
    const shuffled = [...wordsToReview].sort(() => Math.random() - 0.5);

    setReviewList(shuffled);
    setReviewMode(true);
    setCurrentIndex(shuffled[0]);
    setShowTranslation(false);

    toast.success(`Bắt đầu ôn tập ${shuffled.length} từ`);
  };

  const endReviewMode = () => {
    setReviewMode(false);
    setCurrentIndex(0);
    setShowTranslation(false);
    toast.info("Đã kết thúc chế độ ôn tập");
  };

  const handleReviewNext = () => {
    const currentReviewIndex = reviewList.indexOf(currentIndex);

    if (currentReviewIndex < reviewList.length - 1) {
      // Move to next word in review list
      setCurrentIndex(reviewList[currentReviewIndex + 1]);
      setShowTranslation(false);
    } else {
      // End of review
      toast.success("Bạn đã hoàn thành phiên ôn tập!");
      endReviewMode();
    }
  };

  const playWordAudio = () => {
    // Play the pronunciation
    const utterance = new SpeechSynthesisUtterance(currentWord.word);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const isWordSaved = savedWords.includes(`${topicId}-${currentWord.word}`);
  const isWordMastered = mastered.includes(`${topicId}-${currentWord.word}`);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar />
      
      <main className="flex-1 container py-8">
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/topics')}>
              &larr; Quay lại chủ đề
            </Button>
            <h1 className="text-2xl font-bold tracking-tight capitalize">{topicId}</h1>
          </div>
          
          <div className="flex gap-2">
            <Badge variant="outline" className="py-2">
              Đã lưu: {savedWords.filter(id => id.startsWith(`${topicId}-`)).length}/{vocabulary.length}
            </Badge>
            <Badge variant="outline" className="py-2">
              Đã thuộc: {mastered.filter(id => id.startsWith(`${topicId}-`)).length}/{vocabulary.length}
            </Badge>
            
            {/* Add test button */}
            <Button variant="default" onClick={startTest}>
              <TestTube className="mr-1 h-4 w-4" /> Kiểm tra
            </Button>
            
            {reviewMode ? (
              <Button variant="secondary" onClick={endReviewMode}>
                Kết thúc ôn tập
              </Button>
            ) : (
              <Button variant="secondary" onClick={startReviewMode}>
                <RefreshCw className="mr-1" /> Ôn tập
              </Button>
            )}
          </div>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <div className="flex justify-between items-center mb-8">
                <span className="text-sm text-muted-foreground">
                  {reviewMode ? 
                    `Từ ${reviewList.indexOf(currentIndex) + 1} / ${reviewList.length} (ôn tập)` : 
                    `Từ ${currentIndex + 1} / ${vocabulary.length}`}
                </span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={toggleMastered} 
                    title={isWordMastered ? "Xóa khỏi danh sách đã thuộc" : "Đánh dấu là đã thuộc"}>
                    <Check className={`h-6 w-6 ${isWordMastered ? 'text-green-500' : ''}`} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={toggleSaveWord} 
                    title={isWordSaved ? "Xóa khỏi danh sách đã lưu" : "Lưu từ này"}>
                    <Heart className={`h-6 w-6 ${isWordSaved ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                </div>
              </div>
              
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">{currentWord.word}</h2>
                <Button variant="ghost" size="icon" onClick={playWordAudio} 
                  className="hover:bg-blue-100 transition-colors" title="Nghe phát âm">
                  <Volume className="h-6 w-6" />
                </Button>
              </div>
              
              {showTranslation ? (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-secondary/30 p-4 rounded-md">
                    <p className="font-medium">Nghĩa: {currentWord.translation}</p>
                  </div>
                  <div className="bg-secondary/20 p-4 rounded-md">
                    <p className="italic">"{currentWord.example}"</p>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center my-8">
                  <Button onClick={() => setShowTranslation(true)}>
                    Hiện nghĩa
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="flex justify-between mt-6">
            {reviewMode ? (
              <>
                <Button variant="outline" onClick={handleReviewNext}>
                  Tiếp tục ôn tập &rarr;
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={handlePrevious}>
                  &larr; Từ trước
                </Button>
                <div>
                  <Button variant="outline" size="icon" className="mx-1" onClick={() => { setCurrentIndex(0); setShowTranslation(false); }}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="outline" onClick={handleNext}>
                  Từ tiếp theo &rarr;
                </Button>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Vocabulary;

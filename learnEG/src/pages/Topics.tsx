
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Map, Cloud, Computer, Utensils, Music, Film, Globe, Heart, TestTube } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import NavBar from '@/components/NavBar';
import { useAuth } from '@/contexts/AuthContext';

// Define topics with Vietnamese translations
const topics = [
  { id: 'travel', name: 'Du lịch', icon: <Map className="h-8 w-8" />, color: 'bg-blue-500/10 text-blue-500' },
  { id: 'technology', name: 'Công nghệ', icon: <Computer className="h-8 w-8" />, color: 'bg-purple-500/10 text-purple-500' },
  { id: 'weather', name: 'Thời tiết', icon: <Cloud className="h-8 w-8" />, color: 'bg-cyan-500/10 text-cyan-500' },
  { id: 'food', name: 'Ẩm thực', icon: <Utensils className="h-8 w-8" />, color: 'bg-orange-500/10 text-orange-500' },
  { id: 'music', name: 'Âm nhạc', icon: <Music className="h-8 w-8" />, color: 'bg-pink-500/10 text-pink-500' },
  { id: 'movies', name: 'Điện ảnh', icon: <Film className="h-8 w-8" />, color: 'bg-red-500/10 text-red-500' },
  { id: 'culture', name: 'Văn hóa', icon: <Globe className="h-8 w-8" />, color: 'bg-green-500/10 text-green-500' },
  { id: 'relationships', name: 'Mối quan hệ', icon: <Heart className="h-8 w-8" />, color: 'bg-rose-500/10 text-rose-500' },
  { id: 'education', name: 'Giáo dục', icon: <Book className="h-8 w-8" />, color: 'bg-amber-500/10 text-amber-500' },
];

const Topics = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [topicProgress, setTopicProgress] = React.useState<Record<string, number>>({});
  const [topicSaved, setTopicSaved] = React.useState<Record<string, number>>({});

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Calculate progress for each topic
    const progress: Record<string, number> = {};
    const saved: Record<string, number> = {};

    topics.forEach(topic => {
      // Get mastered words
      const masteredFromStorage = localStorage.getItem(`mastered-${topic.id}`);
      const masteredWords = masteredFromStorage ? JSON.parse(masteredFromStorage) : [];
      
      // Get saved words
      const savedFromStorage = localStorage.getItem(`savedWords-${topic.id}`);
      const savedWords = savedFromStorage ? JSON.parse(savedFromStorage) : [];
      
      // Count words related to this topic
      const topicMasteredCount = masteredWords.filter((id: string) => id.startsWith(`${topic.id}-`)).length;
      const topicSavedCount = savedWords.filter((id: string) => id.startsWith(`${topic.id}-`)).length;
      
      // Calculate percentage (assuming 5 words per topic as in the mock data)
      progress[topic.id] = Math.round((topicMasteredCount / 5) * 100);
      saved[topic.id] = topicSavedCount;
    });

    setTopicProgress(progress);
    setTopicSaved(saved);
  }, [isAuthenticated, navigate]);

  const handleTopicSelect = (topicId: string) => {
    navigate(`/vocabulary/${topicId}`);
  };
  
  const handleTakeTest = (e: React.MouseEvent, topicId: string) => {
    e.stopPropagation(); // Prevent the card click from triggering
    navigate(`/test/${topicId}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar />
      
      <main className="flex-1 container py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight">Chọn chủ đề học tập</h1>
          <p className="text-muted-foreground mt-1">Hãy chọn một chủ đề bạn muốn học từ vựng tiếng Anh</p>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {topics.map((topic) => (
            <Card 
              key={topic.id}
              className="cursor-pointer transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]"
              onClick={() => handleTopicSelect(topic.id)}
            >
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <div className={`w-16 h-16 rounded-full ${topic.color} flex items-center justify-center mb-4`}>
                  {topic.icon}
                </div>
                <h3 className="font-medium text-lg mb-1">{topic.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">Học từ vựng tiếng Anh</p>
                
                {/* Progress indicator */}
                <div className="w-full mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Tiến độ</span>
                    <span>{topicProgress[topic.id] || 0}%</span>
                  </div>
                  <Progress value={topicProgress[topic.id] || 0} className="h-2" />
                  
                  <div className="flex items-center justify-between mt-2">
                    {topicSaved[topic.id] > 0 && (
                      <div className="flex items-center text-xs text-rose-500">
                        <Heart className="h-3 w-3 mr-1" fill="currentColor" />
                        <span>{topicSaved[topic.id]} từ đã lưu</span>
                      </div>
                    )}
                    
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="ml-auto text-xs" 
                      onClick={(e) => handleTakeTest(e, topic.id)}
                    >
                      <TestTube className="h-3 w-3 mr-1" />
                      Kiểm tra
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Topics;


import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Volume, CheckCircle2, XCircle } from "lucide-react";

export type QuestionType = 'multipleChoice' | 'fillBlank' | 'listenChoose';

export interface TestQuestionProps {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string;
  userAnswer: string | null;
  isAnswered: boolean;
  onAnswer: (answer: string) => void;
  audio?: string;
}

const TestQuestion: React.FC<TestQuestionProps> = ({
  id,
  type,
  question,
  options = [],
  correctAnswer,
  userAnswer,
  isAnswered,
  onAnswer,
  audio,
}) => {
  const [inputValue, setInputValue] = React.useState('');
  const isCorrect = userAnswer === correctAnswer;
  
  const playAudio = () => {
    // Use the Web Speech API for pronouncing the word
    const utterance = new SpeechSynthesisUtterance(audio || question);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };
  
  const handleSubmitFillBlank = () => {
    onAnswer(inputValue);
  };
  
  const renderFeedback = () => {
    if (!isAnswered) return null;
    
    return (
      <div className="mt-3 flex items-center">
        {isCorrect ? (
          <div className="flex items-center text-green-600">
            <CheckCircle2 className="mr-2 h-5 w-5" />
            <span>Chính xác!</span>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="flex items-center text-red-600">
              <XCircle className="mr-2 h-5 w-5" />
              <span>Chưa đúng</span>
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              Đáp án đúng: <span className="font-medium">{correctAnswer}</span>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  switch (type) {
    case 'multipleChoice':
      return (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="mb-4 text-lg font-medium">{question}</div>
            <RadioGroup 
              className="space-y-3"
              value={userAnswer || ""}
              onValueChange={onAnswer}
              disabled={isAnswered}
            >
              {options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value={option} 
                    id={`${id}-option-${index}`} 
                    className={isAnswered ? (option === correctAnswer ? 'border-green-500' : userAnswer === option ? 'border-red-500' : '') : ''}
                  />
                  <Label 
                    htmlFor={`${id}-option-${index}`}
                    className={
                      isAnswered 
                        ? option === correctAnswer 
                          ? 'text-green-600 font-medium' 
                          : userAnswer === option 
                            ? 'text-red-600' 
                            : ''
                        : ''
                    }
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {renderFeedback()}
          </CardContent>
        </Card>
      );
      
    case 'fillBlank':
      return (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="mb-4 text-lg font-medium">{question}</div>
            <div className="flex gap-2">
              <Input 
                type="text" 
                placeholder="Nhập câu trả lời..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isAnswered}
                className={isAnswered ? (isCorrect ? 'border-green-500' : 'border-red-500') : ''}
              />
              {!isAnswered && (
                <Button onClick={handleSubmitFillBlank}>Trả lời</Button>
              )}
            </div>
            {renderFeedback()}
          </CardContent>
        </Card>
      );
      
    case 'listenChoose':
      return (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="mb-4 flex items-center gap-3">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={playAudio}
                className="rounded-full"
              >
                <Volume className="h-5 w-5" />
              </Button>
              <span className="text-lg font-medium">Nghe và chọn từ đúng</span>
            </div>
            <RadioGroup 
              className="space-y-3"
              value={userAnswer || ""}
              onValueChange={onAnswer}
              disabled={isAnswered}
            >
              {options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value={option} 
                    id={`${id}-option-${index}`} 
                    className={isAnswered ? (option === correctAnswer ? 'border-green-500' : userAnswer === option ? 'border-red-500' : '') : ''}
                  />
                  <Label 
                    htmlFor={`${id}-option-${index}`}
                    className={
                      isAnswered 
                        ? option === correctAnswer 
                          ? 'text-green-600 font-medium' 
                          : userAnswer === option 
                            ? 'text-red-600' 
                            : ''
                        : ''
                    }
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {renderFeedback()}
          </CardContent>
        </Card>
      );
      
    default:
      return null;
  }
};

export default TestQuestion;

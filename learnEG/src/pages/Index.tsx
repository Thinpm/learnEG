
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, MessageCircle, CheckCircle, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      icon: <BookOpen className="h-12 w-12 text-primary" />,
      title: 'Học từ vựng theo chủ đề',
      description: 'Từ vựng được phân loại theo các chủ đề thông dụng, giúp bạn học từ có hệ thống.'
    },
    {
      icon: <MessageCircle className="h-12 w-12 text-primary" />,
      title: 'Phát âm chuẩn xác',
      description: 'Luyện nghe và phát âm với giọng đọc chuẩn từ người bản ngữ.'
    },
    {
      icon: <CheckCircle className="h-12 w-12 text-primary" />,
      title: 'Luyện tập mỗi ngày',
      description: 'Các bài tập đa dạng giúp bạn ghi nhớ từ vựng hiệu quả.'
    },
    {
      icon: <GraduationCap className="h-12 w-12 text-primary" />,
      title: 'Theo dõi tiến độ',
      description: 'Hệ thống theo dõi giúp bạn nắm rõ quá trình học tập của mình.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero section */}
      <header className="w-full py-6 px-4 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto flex justify-between items-center">
          <Logo size="lg" />
          <div className="space-x-2">
            {isAuthenticated ? (
              <Button onClick={() => navigate('/dashboard')}>
                Vào học ngay
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/login')}>
                  Đăng nhập
                </Button>
                <Button onClick={() => navigate('/login')}>
                  Đăng ký
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero content */}
        <section className="py-16 px-4 text-center bg-gradient-to-b from-background to-secondary/5">
          <div className="container mx-auto max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Học tiếng Anh dễ dàng và hiệu quả
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Nền tảng học từ vựng và ngữ pháp tiếng Anh thiết kế riêng cho người Việt Nam
            </p>
            <Button size="lg" onClick={() => isAuthenticated ? navigate('/dashboard') : navigate('/login')}>
              Bắt đầu ngay miễn phí <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 px-4 bg-background">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Tính năng nổi bật</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4 p-6 rounded-lg hover:bg-secondary/5 transition-colors">
                  <div className="shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-primary/5">
          <div className="container mx-auto text-center max-w-2xl">
            <h2 className="text-3xl font-bold mb-4">Sẵn sàng cải thiện tiếng Anh của bạn?</h2>
            <p className="text-muted-foreground mb-8">
              Đăng ký miễn phí và bắt đầu học ngay hôm nay với hơn 5,000 từ vựng thông dụng.
            </p>
            <Button size="lg" onClick={() => isAuthenticated ? navigate('/dashboard') : navigate('/login')}>
              Bắt đầu ngay
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-muted py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Logo />
            <p className="text-muted-foreground text-sm mt-4 md:mt-0">
              © 2023 English Learning App. Đã đăng ký bản quyền.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

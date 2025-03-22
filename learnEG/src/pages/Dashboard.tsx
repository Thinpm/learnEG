
import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, ArrowRight, Book, GraduationCap, Award, Trophy } from 'lucide-react';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  const features = [
    {
      icon: <GraduationCap className="h-5 w-5" />,
      title: 'Từ vựng theo chủ đề',
      description: 'Học từ vựng theo các chủ đề thông dụng.'
    },
    {
      icon: <Book className="h-5 w-5" />,
      title: 'Ngữ pháp cơ bản',
      description: 'Ôn tập các cấu trúc ngữ pháp tiếng Anh.'
    },
    {
      icon: <Trophy className="h-5 w-5" />,
      title: 'Luyện tập hàng ngày',
      description: 'Bài tập củng cố kiến thức mỗi ngày.'
    },
    {
      icon: <Award className="h-5 w-5" />,
      title: 'Thành tích',
      description: 'Theo dõi quá trình học tập của bạn.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar />
      
      <main className="flex-1 container py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight">Chào mừng, {user?.name || 'Học viên'}</h1>
          <p className="text-muted-foreground mt-1">Hãy bắt đầu hành trình học tiếng Anh của bạn.</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card key={index} className="animate-slide-in overflow-hidden transition-all duration-300 hover:shadow-hover">
              <CardHeader className="pb-2">
                <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-primary mb-2">
                  {feature.icon}
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardFooter className="pt-2">
                <Button variant="ghost" className="p-0 h-auto text-sm" asChild>
                  {index === 0 ? (
                    <Link to="/topics" className="inline-flex items-center">
                      Bắt đầu học <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  ) : (
                    <a href="#" className="inline-flex items-center">
                      Sắp ra mắt <ArrowRight className="ml-1 h-3 w-3" />
                    </a>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <Card className="mt-8 glass-card animate-slide-in">
          <CardHeader>
            <CardTitle>Bắt đầu học</CardTitle>
            <CardDescription>Hoàn thành các bước sau để bắt đầu</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="mr-4 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Check className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-medium">Tạo tài khoản</h3>
                  <p className="text-sm text-muted-foreground">Bạn đã đăng nhập thành công</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mr-4 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Check className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-medium">Chọn chủ đề</h3>
                  <p className="text-sm text-muted-foreground">Chọn chủ đề bạn muốn học</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mr-4 h-8 w-8 rounded-full border border-primary/20 flex items-center justify-center text-primary/40">
                  3
                </div>
                <div>
                  <h3 className="text-sm font-medium">Luyện tập mỗi ngày</h3>
                  <p className="text-sm text-muted-foreground">Duy trì việc học tập đều đặn</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link to="/topics">Chọn chủ đề học</Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;

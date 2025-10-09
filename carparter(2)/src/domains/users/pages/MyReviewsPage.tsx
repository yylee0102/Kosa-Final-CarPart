/**
 * 사용자 리뷰 관리 페이지
 * - 내가 작성한 리뷰 조회, 수정, 삭제
 * UserController의 리뷰 관리 API 기반
 */
import React, { useState, useEffect } from 'react';
import PageContainer from '@/shared/components/layout/PageContainer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Star, MessageSquare, Edit, Trash2, Calendar } from 'lucide-react';

interface Review {
  reviewId: number;
  centerName: string;
  rating: number;
  content: string;
  createdDate: string;
  updatedDate?: string;
  hasReply: boolean;
  replyContent?: string;
}

export const MyReviewsPage = () => {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editRating, setEditRating] = useState(5);

  useEffect(() => {
    loadMyReviews();
  }, []);

  const loadMyReviews = () => {
    // Mock data - 실제로는 API 호출: GET /api/users/my-reviews
    const mockReviews: Review[] = [
      {
        reviewId: 1,
        centerName: '신속정비 카센터',
        rating: 5,
        content: '정말 친절하고 꼼꼼하게 수리해주셨습니다. 가격도 합리적이고 추천합니다!',
        createdDate: '2024-01-10',
        hasReply: true,
        replyContent: '좋은 리뷰 감사합니다. 앞으로도 더 나은 서비스로 보답하겠습니다.'
      },
      {
        reviewId: 2,
        centerName: '빠른손 정비소',
        rating: 4,
        content: '전반적으로 만족스럽습니다. 다만 대기시간이 조금 길었어요.',
        createdDate: '2024-01-08',
        updatedDate: '2024-01-09',
        hasReply: false
      },
      {
        reviewId: 3,
        centerName: '믿음직한 카센터',
        rating: 3,
        content: '보통 수준의 서비스였습니다.',
        createdDate: '2024-01-05',
        hasReply: true,
        replyContent: '더 나은 서비스를 위해 노력하겠습니다. 소중한 의견 감사합니다.'
      }
    ];
    setReviews(mockReviews);
  };

  const handleEditReview = () => {
    if (!editingReview) return;

    // API 호출: PUT /api/users/reviews/{id}
    const updatedReview = {
      ...editingReview,
      rating: editRating,
      content: editContent,
      updatedDate: new Date().toISOString().split('T')[0]
    };

    setReviews(prev => 
      prev.map(review => 
        review.reviewId === editingReview.reviewId ? updatedReview : review
      )
    );

    setEditModalOpen(false);
    setEditingReview(null);
    setEditContent('');
    setEditRating(5);
    toast({ title: '리뷰가 수정되었습니다.' });
  };

  const handleDeleteReview = (reviewId: number) => {
    // API 호출: DELETE /api/users/reviews/{id}
    setReviews(prev => prev.filter(review => review.reviewId !== reviewId));
    toast({ title: '리뷰가 삭제되었습니다.' });
  };

  const openEditModal = (review: Review) => {
    setEditingReview(review);
    setEditContent(review.content);
    setEditRating(review.rating);
    setEditModalOpen(true);
  };

  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 cursor-pointer ${
              star <= rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300'
            }`}
            onClick={interactive ? () => setEditRating(star) : undefined}
          />
        ))}
      </div>
    );
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'bg-green-100 text-green-800';
    if (rating >= 3) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* 헤더 */}
        <div>
          <h1 className="text-3xl font-bold">내 리뷰</h1>
          <p className="text-muted-foreground">작성한 리뷰를 확인하고 관리하세요</p>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">작성한 리뷰</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reviews.length}개</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">평균 평점</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getAverageRating().toFixed(1)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">답변 받은 리뷰</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reviews.filter(r => r.hasReply).length}개
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 리뷰 목록 */}
        <Card>
          <CardHeader>
            <CardTitle>작성한 리뷰</CardTitle>
            <CardDescription>카센터에 작성한 리뷰를 확인하고 수정할 수 있습니다</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.reviewId} className="border rounded-lg p-4">
                  {/* 리뷰 헤더 */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{review.centerName}</span>
                      <Badge className={getRatingColor(review.rating)}>
                        {review.rating}점
                      </Badge>
                      {renderStars(review.rating)}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(review)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        수정
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteReview(review.reviewId)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        삭제
                      </Button>
                    </div>
                  </div>

                  {/* 리뷰 내용 */}
                  <p className="text-sm mb-3">{review.content}</p>

                  {/* 날짜 정보 */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>작성일: {review.createdDate}</span>
                    </div>
                    {review.updatedDate && (
                      <span>수정일: {review.updatedDate}</span>
                    )}
                  </div>

                  {/* 카센터 답변 */}
                  {review.hasReply && review.replyContent && (
                    <div className="bg-blue-50 border-l-4 border-blue-200 p-3 rounded">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-blue-800">카센터 답변</span>
                      </div>
                      <p className="text-sm text-blue-700">{review.replyContent}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 리뷰 수정 모달 */}
        <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>리뷰 수정</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {editingReview && (
                <div className="p-3 bg-gray-50 rounded">
                  <span className="font-medium">{editingReview.centerName}</span>
                </div>
              )}
              <div>
                <label className="text-sm font-medium mb-2 block">평점</label>
                {renderStars(editRating, true)}
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">리뷰 내용</label>
                <Textarea
                  placeholder="리뷰를 입력하세요..."
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleEditReview} className="flex-1">
                  수정 완료
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setEditModalOpen(false);
                    setEditingReview(null);
                    setEditContent('');
                    setEditRating(5);
                  }}
                >
                  취소
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PageContainer>
  );
};
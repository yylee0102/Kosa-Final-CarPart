/**
 * 카센터 리뷰 답변 관리 페이지
 * - 리뷰에 대한 답변 작성, 수정, 삭제
 * - 리뷰 신고 기능
 * CarCenterController의 리뷰 답변 및 신고 API 기반
 */
import React, { useState, useEffect } from 'react';
import PageContainer from '@/shared/components/layout/PageContainer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Star, MessageSquare, Flag, Edit, Trash2, Plus } from 'lucide-react';

interface Review {
  reviewId: number;
  customerName: string;
  rating: number;
  content: string;
  createdDate: string;
  hasReply: boolean;
  reply?: ReviewReply;
}

interface ReviewReply {
  replyId: number;
  content: string;
  createdDate: string;
}

export const ReviewReplyManagementPage = () => {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = () => {
    // Mock data - 실제로는 API 호출
    const mockReviews: Review[] = [
      {
        reviewId: 1,
        customerName: '김고객',
        rating: 5,
        content: '정말 친절하고 꼼꼼하게 수리해주셨습니다. 가격도 합리적이고 추천합니다!',
        createdDate: '2024-01-10',
        hasReply: true,
        reply: {
          replyId: 1,
          content: '좋은 리뷰 감사합니다. 앞으로도 더 나은 서비스로 보답하겠습니다.',
          createdDate: '2024-01-11'
        }
      },
      {
        reviewId: 2,
        customerName: '이고객',
        rating: 4,
        content: '전반적으로 만족스럽습니다. 다만 대기시간이 조금 길었어요.',
        createdDate: '2024-01-12',
        hasReply: false
      },
      {
        reviewId: 3,
        customerName: '박고객',
        rating: 2,
        content: '서비스가 아쉬웠습니다. 설명이 부족했어요.',
        createdDate: '2024-01-13',
        hasReply: false
      }
    ];
    setReviews(mockReviews);
  };

  const handleCreateReply = () => {
    if (!selectedReview || !replyContent.trim()) return;

    // API 호출: POST /api/car-centers/replies
    const newReply: ReviewReply = {
      replyId: Date.now(),
      content: replyContent,
      createdDate: new Date().toISOString().split('T')[0]
    };

    setReviews(prev => 
      prev.map(review => 
        review.reviewId === selectedReview.reviewId 
          ? { ...review, hasReply: true, reply: newReply }
          : review
      )
    );

    setReplyContent('');
    setReplyModalOpen(false);
    setSelectedReview(null);
    toast({ title: '답변이 등록되었습니다.' });
  };

  const handleUpdateReply = (reviewId: number, newContent: string) => {
    // API 호출: PUT /api/car-centers/replies/{replyId}
    setReviews(prev => 
      prev.map(review => 
        review.reviewId === reviewId && review.reply
          ? { 
              ...review, 
              reply: { 
                ...review.reply, 
                content: newContent,
                createdDate: new Date().toISOString().split('T')[0]
              }
            }
          : review
      )
    );
    toast({ title: '답변이 수정되었습니다.' });
  };

  const handleDeleteReply = (reviewId: number) => {
    const review = reviews.find(r => r.reviewId === reviewId);
    if (!review?.reply) return;

    // API 호출: DELETE /api/car-centers/replies/{replyId}
    setReviews(prev => 
      prev.map(review => 
        review.reviewId === reviewId 
          ? { ...review, hasReply: false, reply: undefined }
          : review
      )
    );
    toast({ title: '답변이 삭제되었습니다.' });
  };

  const handleReportReview = (reviewId: number) => {
    // API 호출: POST /api/car-centers/reports
    toast({ title: '리뷰가 신고되었습니다.' });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300'
            }`}
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

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* 헤더 */}
        <div>
          <h1 className="text-3xl font-bold">리뷰 답변 관리</h1>
          <p className="text-muted-foreground">고객 리뷰에 답변하고 피드백을 관리하세요</p>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">전체 리뷰</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reviews.length}개</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">답변 완료</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reviews.filter(r => r.hasReply).length}개
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">평균 평점</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reviews.length > 0 
                  ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
                  : '0.0'
                }
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 리뷰 목록 */}
        <Card>
          <CardHeader>
            <CardTitle>리뷰 목록</CardTitle>
            <CardDescription>고객이 작성한 리뷰를 확인하고 답변을 관리하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.reviewId} className="border rounded-lg p-4">
                  {/* 리뷰 내용 */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{review.customerName}</span>
                        <Badge className={getRatingColor(review.rating)}>
                          {review.rating}점
                        </Badge>
                        {renderStars(review.rating)}
                        <span className="text-sm text-muted-foreground">{review.createdDate}</span>
                      </div>
                      <div className="flex gap-2">
                        {!review.hasReply && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedReview(review);
                              setReplyModalOpen(true);
                            }}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            답변 작성
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReportReview(review.reviewId)}
                        >
                          <Flag className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm">{review.content}</p>
                  </div>

                  {/* 답변 내용 */}
                  {review.hasReply && review.reply && (
                    <div className="mt-4 pl-4 border-l-2 border-blue-200 bg-blue-50 p-3 rounded">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-blue-800">카센터 답변</span>
                            <span className="text-sm text-blue-600">{review.reply.createdDate}</span>
                          </div>
                          <p className="text-sm text-blue-700">{review.reply.content}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedReview(review);
                              setReplyContent(review.reply?.content || '');
                              setReplyModalOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteReply(review.reviewId)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 답변 작성/수정 모달 */}
        <Dialog open={replyModalOpen} onOpenChange={setReplyModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedReview?.hasReply ? '답변 수정' : '답변 작성'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {selectedReview && (
                <div className="p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">{selectedReview.customerName}</span>
                    {renderStars(selectedReview.rating)}
                  </div>
                  <p className="text-sm text-gray-600">{selectedReview.content}</p>
                </div>
              )}
              <div>
                <Textarea
                  placeholder="답변을 입력하세요..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateReply} className="flex-1">
                  {selectedReview?.hasReply ? '답변 수정' : '답변 등록'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setReplyModalOpen(false);
                    setSelectedReview(null);
                    setReplyContent('');
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
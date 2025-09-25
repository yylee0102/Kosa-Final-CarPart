// 가격 포맷팅 (한국 원화)
export const formatKRW = (amount: number): string => {
  return new Intl.NumberFormat('ko-KR').format(amount) + '원';
};

// 가격을 만원 단위로 포맷팅
export const formatKRWShort = (amount: number): string => {
  if (amount >= 10000) {
    const manWon = Math.floor(amount / 10000);
    const remainder = amount % 10000;
    
    if (remainder === 0) {
      return `${manWon}만원`;
    } else {
      return `${manWon}만 ${remainder.toLocaleString()}원`;
    }
  }
  return formatKRW(amount);
};

// 시간 경과 포맷팅
export const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMilliseconds = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInMinutes < 1) return "방금 전";
  if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
  if (diffInHours < 24) return `${diffInHours}시간 전`;
  if (diffInDays < 7) return `${diffInDays}일 전`;
  if (diffInWeeks < 4) return `${diffInWeeks}주 전`;
  if (diffInMonths < 12) return `${diffInMonths}개월 전`;
  return `${diffInYears}년 전`;
};

// 한국 날짜 포맷팅
export const formatKoreanDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
};

// 한국 날짜+시간 포맷팅 
export const formatKoreanDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

// 휴대폰 번호 포맷팅
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  } else if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  }
  
  return phone;
};

// 사업자등록번호 포맷팅
export const formatBusinessNumber = (number: string): string => {
  const cleaned = number.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3');
  }
  
  return number;
};

// 파일 크기 포맷팅
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 숫자를 한국어로 포맷팅 (조회수 등)
export const formatNumber = (num: number): string => {
  if (num >= 100000000) { // 1억 이상
    return `${Math.floor(num / 100000000)}억${num % 100000000 !== 0 ? Math.floor((num % 100000000) / 10000) + '만' : ''}`;
  } else if (num >= 10000) { // 1만 이상
    return `${Math.floor(num / 10000)}만${num % 10000 !== 0 ? Math.floor(num % 10000) : ''}`;
  } else if (num >= 1000) { // 1천 이상
    return `${Math.floor(num / 1000)}천${num % 1000 !== 0 ? num % 1000 : ''}`;
  }
  return num.toString();
};
import React, { useState, useMemo, useRef } from 'react';
import * as S from '../css/AdminStyle';

const PAGE_SIZE = 5;

// 샘플 남녀 데이터
const genderData = [
  { gender: 'Male', value: '40' },
  { gender: 'FeMale', value: '15' },
];

/* ---------- SVG 파이차트 컴포넌트 ---------- */
function GenderPieChart({ data, size = 180 }) {
  const total = data.reduce((acc, d) => acc + d.value, 0);
  if (!total) return <S.ChartContainer>데이터 없음</S.ChartContainer>;

  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2;

  const polarToCartesian = (cx, cy, r, angleDeg) => {
    const angleRad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad) };
  };

  const describeSlice = (cx, cy, r, startAngle, endAngle) => {
    const start = polarToCartesian(cx, cy, r, endAngle);
    const end = polarToCartesian(cx, cy, r, startAngle);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${cx} ${cy} L ${end.x} ${end.y} A ${r} ${r} 0 ${largeArc} 1 ${start.x} ${start.y} Z`;
  };

  let accAngle = 0;
  const slices = data.map((d) => {
    const angle = (d.value / total) * 360;
    const path = describeSlice(cx, cy, r, accAngle, accAngle + angle);
    accAngle += angle;
    return { ...d, path };
  });

  return (
    <div style={{ display: 'grid', placeItems: 'center' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="성별 비율 파이차트">
        {slices.map((s, i) => (
          <path key={`${s.label}-${i}`} d={s.path} fill={i === 0 ? '#3b82f6' : '#f472b6'} />
        ))}
      </svg>
    </div>
  );
}

const Admin = () => {
  const [pageBySection, setPageBySection] = useState({});
  const headerRef = useRef(null);

  // 네비게이션 아이템 (id는 섹션 앵커와 매핑)
  const navItems = [
    { id: 'charts', label: '차트' },
    { id: 'inquiries', label: '문의사항 관리' },
    { id: 'reports', label: '신고 후기 관리' },
    { id: 'notices', label: '공지 사항 관리' },
  ];

  const sectionIdMap = {
    '문의사항 관리': 'inquiries',
    '신고 후기 관리': 'reports',
    '공지 사항 관리': 'notices',
  };

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const headerH = headerRef.current?.offsetHeight || 0;
    const top = el.getBoundingClientRect().top + window.pageYOffset - headerH - 8;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  // 남/여 비율 집계
  const { chartData, malePct, femalePct } = useMemo(() => {
    const counts = genderData.reduce(
      (acc, g) => {
        const key = String(g.gender || '').toLowerCase();
        const val = Number(g.value) || 0;
        if (key.startsWith('m')) acc.male += val;
        else if (key.startsWith('f')) acc.female += val;
        return acc;
      },
      { male: 0, female: 0 }
    );
    const total = counts.male + counts.female;
    const mPct = total ? Math.round((counts.male / total) * 100) : 0;
    const fPct = total ? 100 - mPct : 0;

    return {
      chartData: [
        { label: '남성', value: counts.male },
        { label: '여성', value: counts.female },
      ],
      malePct: mPct,
      femalePct: fPct,
    };
  }, []);

  // 샘플 데이터
  const progressData = [
    { label: '20s', value: 85 },
    { label: '30s', value: 70 },
    { label: '40s', value: 45 },
    { label: '50s', value: 30 },
    { label: '60+', value: 30 },
  ];

  const statsData = [
    { label: '총 카센터 수', value: '400' },
    { label: '총 유저 수', value: '1000' },
    { label: '고객센터 질문 수', value: '4' },
    { label: '신고된 후기 수', value: '2' },
  ];

  const tableData = [
    { id: 1, name: '홍길동', phone: '010-1234-5678', content: '문의사항 관련 질문입니다. 답변 부탁드립니다.', date: '2024-01-15', status: 'active' },
    { id: 2, name: '김철수', phone: '010-9876-5432', content: '서비스 이용 중 오류가 발생했습니다.', date: '2024-01-14', status: 'inactive' },
    { id: 3, name: '김철수', phone: '010-9876-5432', content: '서비스 이용 중 오류가 발생했습니다.', date: '2024-01-14', status: 'inactive' },
    { id: 4, name: '김철수', phone: '010-9876-5432', content: '서비스 이용 중 오류가 발생했습니다.', date: '2024-01-14', status: 'inactive' },
    { id: 5, name: '김철수', phone: '010-9876-5432', content: '서비스 이용 중 오류가 발생했습니다.', date: '2024-01-14', status: 'inactive' },
    { id: 6, name: '김철수', phone: '010-9876-5432', content: '서비스 이용 중 오류가 발생했습니다.', date: '2024-01-14', status: 'inactive' },
  ];

  const sections = useMemo(
    () => [
      { title: '문의사항 관리', data: tableData },
      { title: '공지 사항 관리', data: tableData },
      { title: '신고 후기 관리', data: tableData },
    ],
    []
  );

  const goTo = (sectionTitle, page, totalPages) => {
    if (page < 1 || page > totalPages) return;
    setPageBySection((prev) => ({ ...prev, [sectionTitle]: page }));
  };

  return (
    <>
      {S.GlobalStyle ? <S.GlobalStyle /> : null}

      <S.Container>
        <S.MainContent>
          {/* 상단 고정 헤더 */}
          <S.Header
            ref={headerRef}
            style={{ position: 'sticky', top: 0, zIndex: 100 }}
          >
            <S.HeaderTitle>관리자 페이지</S.HeaderTitle>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginTop: 12 }}>
              {navItems.map((n) => (
                <S.Button key={n.id} className="secondary" onClick={() => scrollToId(n.id)}>
                  {n.label}
                </S.Button>
              ))}
            </div>
          </S.Header>

          {/* 차트 섹션 */}
          <div id="charts">
            <S.CardGrid>
              <S.Card>
                <S.CardTitle>생성 차트 (남/여 비율)</S.CardTitle>
                <div style={{ display: 'grid', gap: 12 }}>
                  <GenderPieChart data={chartData} size={180} />
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 10, height: 10, borderRadius: 99, background: '#3b82f6' }} />
                      <span>남성</span>
                      <strong style={{ marginLeft: 4 }}>{malePct}%</strong>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 10, height: 10, borderRadius: 99, background: '#f472b6' }} />
                      <span>여성</span>
                      <strong style={{ marginLeft: 4 }}>{femalePct}%</strong>
                    </div>
                  </div>
                </div>
              </S.Card>

              <S.Card>
                <S.CardTitle>연령 차트</S.CardTitle>
                <S.ProgressContainer>
                  {progressData.map((item, index) => (
                    <S.ProgressItem key={index}>
                      <S.ProgressLabel>{item.label}</S.ProgressLabel>
                      <S.ProgressBar>
                        <S.ProgressFill width={item.value} />
                      </S.ProgressBar>
                      <S.ProgressValue>{item.value}%</S.ProgressValue>
                    </S.ProgressItem>
                  ))}
                </S.ProgressContainer>
              </S.Card>
            </S.CardGrid>
          </div>

          {/* 통계 요약 */}
          <S.FullWidthCard>
            <S.CardTitle>1개월간 통계 요약</S.CardTitle>
            <S.StatsGrid>
              {[
                { label: '총 카센터 수', value: '400' },
                { label: '총 유저 수', value: '1000' },
                { label: '고객센터 질문 수', value: '4' },
                { label: '신고된 후기 수', value: '2' },
              ].map((s, i) => (
                <S.StatItem key={i}>
                  <S.StatLabel>{s.label}</S.StatLabel>
                  <S.StatValue>{s.value}</S.StatValue>
                </S.StatItem>
              ))}
            </S.StatsGrid>
          </S.FullWidthCard>

          {/* 섹션별 테이블 */}
          {sections.map((section, idx) => {
            const totalItems = section.data.length;
            const totalPages = Math.ceil(totalItems / PAGE_SIZE) || 1;
            const currentPage = pageBySection[section.title] || 1;
            const start = (currentPage - 1) * PAGE_SIZE;
            const end = start + PAGE_SIZE;
            const pagedData = section.data.slice(start, end);
            const anchorId = sectionIdMap[section.title] || `section-${idx}`;

            return (
              <div id={anchorId} key={anchorId}>
                <S.FullWidthCard>
                  <S.CardTitle>{section.title}</S.CardTitle>
                  <S.TableContainer>
                    <S.Table>
                      <S.TableHeader>
                        <tr>
                          <S.TableHeaderCell>번호</S.TableHeaderCell>
                          <S.TableHeaderCell>작성자명</S.TableHeaderCell>
                          <S.TableHeaderCell>휴대폰번호</S.TableHeaderCell>
                          <S.TableHeaderCell>내용</S.TableHeaderCell>
                          <S.TableHeaderCell>작성일</S.TableHeaderCell>
                          <S.TableHeaderCell>상태</S.TableHeaderCell>
                          <S.TableHeaderCell>관리</S.TableHeaderCell>
                        </tr>
                      </S.TableHeader>
                      <S.TableBody>
                        {pagedData.map((item, i) => {
                          const rowKey = `${section.title}-${start + i}-${item.id}`;
                          return (
                            <S.TableRow key={rowKey}>
                              <S.TableCell>{item.id}</S.TableCell>
                              <S.TableCell>{item.name}</S.TableCell>
                              <S.TableCell>{item.phone}</S.TableCell>
                              <S.ContentCell>
                                <div>{item.content}</div>
                              </S.ContentCell>
                              <S.TableCell>{item.date}</S.TableCell>
                              <S.TableCell>
                                <S.StatusBadge className={item.status}>
                                  {item.status === 'active' ? '활성' : '비활성'}
                                </S.StatusBadge>
                              </S.TableCell>
                              <S.TableCell>
                                <S.ButtonGroup>
                                  <S.Button className="primary">수정</S.Button>
                                  <S.Button className="danger">삭제</S.Button>
                                </S.ButtonGroup>
                              </S.TableCell>
                            </S.TableRow>
                          );
                        })}
                      </S.TableBody>
                    </S.Table>
                  </S.TableContainer>

                  <S.Pagination>
                    <S.PaginationButton onClick={() => goTo(section.title, currentPage - 1, totalPages)}>‹</S.PaginationButton>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <S.PaginationButton
                        key={`${anchorId}-page-${p}`}
                        className={p === currentPage ? 'active' : undefined}
                        onClick={() => goTo(section.title, p, totalPages)}
                      >
                        {p}
                      </S.PaginationButton>
                    ))}
                    <S.PaginationButton onClick={() => goTo(section.title, currentPage + 1, totalPages)}>›</S.PaginationButton>
                  </S.Pagination>
                </S.FullWidthCard>
              </div>
            );
          })}
        </S.MainContent>
      </S.Container>
    </>
  );
};

export default Admin;

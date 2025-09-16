package com.spring.carparter.repository;

import com.spring.carparter.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    /**
     * 전화번호를 기준으로 사용자를 조회합니다.
     * 사용자가 아이디를 잊었을 때 등 본인인증 용도로 활용될 수 있습니다.
     *
     * @param phoneNumber 사용자의 전화번호
     * @return 전화번호와 일치하는 사용자 정보 (Optional)
     */
    Optional<User> findByPhoneNumber(String phoneNumber);

    /**
     * 사용자 아이디(userId)가 이미 존재하는지 확인합니다.
     * 회원가입 시 아이디 중복 검사에 사용됩니다.
     *
     * @param userId 확인할 사용자 아이디
     * @return 아이디 존재 여부 (true/false)
     */
    boolean existsByUserId(String userId);
    void deleteByUserId(String userId);
    User findByUserId(String userId);

    /**
     * 남여 성별 숫자를 가져옵니다.
     * 관리자에게 보여줄 데이터 입니다.
     *
     * @return 남여 성별 숫자를 return
     * */


    @Query(value = """
        SELECT
          SUM(CASE
                WHEN SUBSTRING(REPLACE(ssn,'-',''), 7, 1) IN ('1','3') THEN 1
                ELSE 0
              END) AS male_cnt,
          SUM(CASE
                WHEN SUBSTRING(REPLACE(ssn,'-',''), 7, 1) IN ('2','4') THEN 1
                ELSE 0
              END) AS female_cnt
        FROM users
        WHERE ssn IS NOT NULL
          AND LENGTH(REPLACE(ssn,'-','')) = 13
        """, nativeQuery = true)
    List<Object[]> countMaleFemaleRaw();

    /**
     * 나이대별 사용자 정보를 가져옵니다.
     * 관리자에게 보여줄 데이터 입니다.
     *
     * @return 나이대별 사용자 정보를 return
     * */
    @Query(value = """
      SELECT band AS label, COUNT(*) AS cnt
      FROM (
        SELECT
          CASE
            WHEN birth IS NULL THEN 'UNKNOWN'
            WHEN TIMESTAMPDIFF(YEAR, birth, CURDATE()) BETWEEN 20 AND 29 THEN '20s'
            WHEN TIMESTAMPDIFF(YEAR, birth, CURDATE()) BETWEEN 30 AND 39 THEN '30s'
            WHEN TIMESTAMPDIFF(YEAR, birth, CURDATE()) BETWEEN 40 AND 49 THEN '40s'
            WHEN TIMESTAMPDIFF(YEAR, birth, CURDATE()) BETWEEN 50 AND 59 THEN '50s'
            ELSE '60s+'
          END AS band
        FROM (
          SELECT
            CASE
              WHEN SUBSTRING(REPLACE(ssn,'-',''),7,1) IN ('1','2')
                THEN STR_TO_DATE(CONCAT('19', SUBSTRING(REPLACE(ssn,'-',''),1,6)), '%Y%m%d')
              WHEN SUBSTRING(REPLACE(ssn,'-',''),7,1) IN ('3','4')
                THEN STR_TO_DATE(CONCAT('20', SUBSTRING(REPLACE(ssn,'-',''),1,6)), '%Y%m%d')
              ELSE NULL
            END AS birth
          FROM users
          WHERE ssn IS NOT NULL
            AND LENGTH(REPLACE(ssn,'-','')) >= 7
        ) t
      ) b
      GROUP BY label
      ORDER BY FIELD(label,'20s','30s','40s','50s','60s+','UNKNOWN')
      """, nativeQuery = true)
    List<Object[]> ageBandRows();
}

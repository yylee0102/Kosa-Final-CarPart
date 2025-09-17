package org.example;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

//TIP 코드를 <b>실행</b>하려면 <shortcut actionId="Run"/>을(를) 누르거나
// 에디터 여백에 있는 <icon src="AllIcons.Actions.Execute"/> 아이콘을 클릭하세요.
public class Main {
    public static void main(String[] args) {
        List<Member> memberList = new ArrayList<>();
        memberList.add(new Member(5L, "박성우"));
        memberList.add(new Member(2L, "김요한"));
        memberList.add(new Member(1L, "장재민"));

        System.out.println("정렬전");
        memberList.forEach(System.out::println);

        List<Member> sortedResult = sortMembers(memberList);
        System.out.println("정렬후");
        for (Member member : sortedResult) {
            System.out.println(member);
        }




    }
        public static  List<Member> sortMembers(List<Member> members){
            List<Member> sortedList  = new ArrayList<>(members);

            sortedList.sort(Comparator.comparing(Member::getName)
                    .thenComparing(Member::getId, Comparator.reverseOrder()));
            return sortedList;
        }
    }

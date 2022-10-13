---
categories:
  - Development
  - React
date: '2022-10-13'
description: React에서 필수인 상태 관리, 이 상태 관리도 Server State와 UI State로 나누어 볼 수 있다.
slug: server-state-and-ui-state
tags:
  - state management
  - server state
  - ui state
title: Server State와 UI State에 대해 알아보기
---

# React의 상태 관리

컴포넌트에서는 유동적인 데이터를 다룰 때, state를 사용한다.
State는 props와 유사하지만, 비공개이며 컴포넌트에 의해 완전히 제어된다.

## Server State (서버 상태)

- 서버 상태에 관해서는 실질적으로 앱이 소유하지 않는다.
- 서버 상태는 사용자를 위해 최신 버전을 화면에 표시하기 위해 값들을 빌렸을 뿐이고, 실질적인 데이터를 소유한 것은 서버인 것이다.
- 예를 들어 `글 목록`, `표시할 사용자의 세부 정보` 등이 이에 속한다.

## UI State (UI 상태)

- UI State는 사용자와 상호작용하는 인터렉션을 제어하기 위한 상태들이다.
- 예를 들어 `모달 open/close`, `다크모드 on/off`, `클릭한 페이징 번호` 등이 이에 속한다.

## 참고문서

- https://reactjs.org/docs/faq-state.html
- https://ko.reactjs.org/docs/state-and-lifecycle.html
- https://tkdodo.eu/blog/practical-react-query#client-state-vs-server-state

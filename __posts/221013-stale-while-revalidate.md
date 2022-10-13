---
categories:
  - Development
  - Web
date: '2022-10-13'
description: Cache-Control 기능 중 하나인 stale-while-revalidate이란 무엇이고, 어떤 매커니즘으로 동작하는가?
tags:
  - front-end
  - cache
  - performance
title: stale-while-revalidate 란? 매커니즘과 함께 알아보기
---

# stale-while-revalidate

## 정의

- stale : 오래된
- while : ~하는 동안
- revalidate : 1. 재확인하다 2. 갱신하다

이어보면, 오래된 것을 갱신한다는 뜻으로 해석된다.

rfc 문서에 따르면, HTTP 응답 헤더의 `Cache-Control`에 `stale-while-revalidate`가 있는 경우, 캐시가 지정된 시간(초)까지 오래된 응답을 제공할 수 있다고 기술되어 있다.

### Cache-Control 이란 무엇일까?

HTTP 응답 헤더에 포함된 `Cache-Control` 헤더에 따라 리소스의 유효기간이 정해진다.
`Cache-Control: max-age=100` 을 지정하게 되면 100초안에 해당 리소스를 또 요청하게 되었을 때, 브라우저는 서버에 요청을 보내지 않고 디스크 또는 메모리에서 캐시를 읽어와 재사용하는 것이다.

## stale-while-revalidate의 매커니즘

1. 사용자가 요청`/image/flower`을 보내어 리소스를 받는다.
2. 이 리소스의 응답 헤더에는 `Cache-Control: max-age=600, stale-while-revalidate=60` 이 설정되어있다.

3. 조건에 따른 3가지의 응답
   1. 600초가 지나기 전 재요청
      - 브라우저에서 캐시에 저장되어있는 리소스로 응답해준다.
   2. 600초가 지나고 660초가 되기 전 재요청
      - 브라우저에서 캐시에 저장되어있는 오래된 캐싱 리소스로 응답해준다.
      - 백그라운드에서 새로운 리소스를 요청해서 응답받아 오래된 캐싱 리소스를 최신 리소스로 캐시를 갱신한다.
   3. 660초 이후의 재요청
      - 브라우저 캐시의 데이터를 오래된 리소스라고 판단해 새로운 요청을 보낸다.

## 참고 문서

- https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control 입니다
- https://web.dev/stale-while-revalidate/
- https://www.rfc-editor.org/rfc/rfc5861#section-3

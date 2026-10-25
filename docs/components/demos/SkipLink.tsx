import { SkipLink } from '@krds.ui/react'

export default function SkipLinkDemo() {
  return (
    <>
      <SkipLink targetId="main">본문 바로가기</SkipLink>
      <main id="main">본문</main>
    </>
  )
}

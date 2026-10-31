import { useState } from 'react'
import {
  Accordion,
  Badge,
  Breadcrumb,
  Button,
  Footer,
  Header,
  Masthead,
  Pagination,
  SideNavigation,
  SkipLink,
  StepIndicator,
  Tab,
  TabList,
  TabPanel,
  TabTrigger,
  Table,
  Tooltip
} from '@krds.ui/react'
import { componentGroups } from '../../.vitepress/component-groups'
import ApplicationForm from './playground/ApplicationForm'

const sections = [
  ['pg-form', '입력·선택'],
  ['pg-feedback', '피드백'],
  ['pg-help', '도움'],
  ['pg-content', '레이아웃 및 표현'],
  ['pg-navigation', '탐색·액션']
] as const
const records = [
  ['주민등록표 등본 발급', '2026.10.02', '완료'],
  ['전입신고', '2026.10.05', '처리 중'],
  ['여권 재발급', '2026.10.07', '접수'],
  ['건축물대장 열람', '2026.10.09', '완료'],
  ['지방세 납세증명', '2026.10.11', '처리 중'],
  ['가족관계증명서 발급', '2026.10.13', '접수']
]
const menuLinks = [
  { label: '설치와 사용법', href: '/guide/getting-started' },
  { label: '컴포넌트 목록', href: '/components/' },
  { label: '자주 묻는 질문', href: '/guide/faq' }
]

/** Vue 플레이그라운드와 같은 공공서비스 흐름을 React 컴포넌트로 구성한다. */
export default function Playground() {
  const [step, setStep] = useState(0)
  const [page, setPage] = useState(1)
  return (
    <div id="wrap" className="g-wrap krds-playground vp-raw">
      <SkipLink targetId="container">본문 바로가기</SkipLink>
      <Masthead role="region" aria-label="예시 누리집 안내" text="이 누리집은 KRDS React 컴포넌트로 만든 예시 누리집입니다." />
      <Header>
        <Header.Container>
          <Header.Utilities>
            <a href="/" className="krds-btn small text">
              KRDS React 문서로 돌아가기
            </a>
          </Header.Utilities>
          <div className="header-branding">
            <h2 className="logo">
              <a className="pg-brand" href="/playground">
                <img src="/logo.svg" alt="" width={48} height={48} />
                <span>KRDS React</span>
              </a>
            </h2>
            <Header.Navi>
              <a href="/components/" className="btn-navi sch">
                컴포넌트 찾기
              </a>
            </Header.Navi>
          </div>
        </Header.Container>
        <Header.MainMenu
          desktop={{
            items: [
              { type: 'dropdown', label: '시작하기', sections: menuLinks.map(link => ({ type: 'link', ...link })) },
              {
                type: 'dropdown',
                label: '컴포넌트',
                sections: componentGroups.map(group => ({
                  type: 'menu',
                  label: group.text,
                  items: group.pages.map(([label, slug]) => ({ label, href: `/components/${slug}` }))
                }))
              },
              { type: 'link', label: 'npm 패키지', href: 'https://www.npmjs.com/package/@krds.ui/react', isExternal: true }
            ]
          }}
          mobile={{
            body: {
              mainItems: [
                { label: '시작하기', panels: [{ label: '문서', items: menuLinks.map(link => ({ type: 'link', ...link })) }] },
                {
                  label: '컴포넌트',
                  panels: componentGroups.map(group => ({
                    label: group.text,
                    items: group.pages.map(([label, slug]) => ({ type: 'link', label, href: `/components/${slug}` }))
                  }))
                }
              ]
            }
          }}
        />
      </Header>
      <main id="container" tabIndex={-1}>
        <div className="inner in-between">
          <SideNavigation aria-label="플레이그라운드 구성">
            <SideNavigation.Title>플레이그라운드</SideNavigation.Title>
            <SideNavigation.Menu>
              {sections.map(([id, title]) => (
                <SideNavigation.Item key={id}>
                  <SideNavigation.Link href={`#${id}`}>{title}</SideNavigation.Link>
                </SideNavigation.Item>
              ))}
            </SideNavigation.Menu>
          </SideNavigation>
          <div className="contents">
            <Breadcrumb
              items={[
                { text: '홈', href: '/' },
                { text: '플레이그라운드', href: '/playground' }
              ]}
            />
            <h1 className="pg-title">컴포넌트 플레이그라운드</h1>
            <p className="pg-intro">
              KRDS React 컴포넌트를 실제 공공 누리집처럼 조합했습니다. 메뉴, 입력, 도움말과 모달을 직접 조작해 보세요.
            </p>
            <div className="pg-notice">
              <strong>체험용 화면입니다.</strong> 입력한 정보는 서버로 전송하지 않습니다. 설치 패키지는 <code>@krds.ui/react</code>입니다.
            </div>
            <nav className="pg-links" aria-label="이 페이지의 구성">
              {sections.map(([id, title]) => (
                <a key={id} href={`#${id}`}>
                  {title}
                </a>
              ))}
            </nav>
            <section id="pg-form" className="pg-part" aria-labelledby="pg-form-title">
              <h2 id="pg-form-title">입력·선택</h2>
              <ApplicationForm />
            </section>
            <section id="pg-feedback" className="pg-part" aria-labelledby="pg-feedback-title">
              <h2 id="pg-feedback-title">피드백</h2>
              <p className="pg-hint">이전·다음 단계 버튼으로 단계 표시기의 상태를 바꿔 보세요.</p>
              <StepIndicator
                currentStep={step}
                steps={[
                  { step: '1단계', title: '신청' },
                  { step: '2단계', title: '서류 검토' },
                  { step: '3단계', title: '처리' },
                  { step: '4단계', title: '완료' }
                ]}
              />
              <div className="pg-links">
                <Button variant="tertiary" disabled={step === 0} onClick={() => setStep(step - 1)}>
                  이전 단계
                </Button>
                <Button disabled={step === 3} onClick={() => setStep(step + 1)}>
                  다음 단계
                </Button>
              </div>
              <p role="status">현재 단계: {step + 1} / 4</p>
              <div className="pg-row pg-section">
                <Badge color="information" variant="light">
                  처리 중
                </Badge>
                <Badge color="success" variant="light">
                  완료
                </Badge>
                <Badge color="gray" variant="light">
                  접수
                </Badge>
              </div>
            </section>
            <section id="pg-help" className="pg-part" aria-labelledby="pg-help-title">
              <h2 id="pg-help-title">도움</h2>
              <Tooltip text="예시 화면에서는 본인 인증이나 실제 민원 신청을 진행하지 않습니다.">본인 인증 안내</Tooltip>
              <div className="pg-section">
                <h3>자주 묻는 질문</h3>
                <Accordion>
                  <Accordion.Item value="demo">
                    <Accordion.Header aria-level={4}>실제 민원을 신청할 수 있나요?</Accordion.Header>
                    <Accordion.Panel>
                      컴포넌트 동작을 확인하는 체험용 화면입니다. 입력한 정보는 저장하거나 전송하지 않습니다.
                    </Accordion.Panel>
                  </Accordion.Item>
                  <Accordion.Item value="package">
                    <Accordion.Header aria-level={4}>어떤 패키지를 설치하나요?</Accordion.Header>
                    <Accordion.Panel>
                      <code>npm install @krds.ui/react</code>로 설치합니다. <a href="/guide/getting-started">설치와 스타일 설정 보기</a>
                    </Accordion.Panel>
                  </Accordion.Item>
                </Accordion>
              </div>
            </section>
            <section id="pg-content" className="pg-part" aria-labelledby="pg-content-title">
              <h2 id="pg-content-title">레이아웃 및 표현</h2>
              <Tab defaultValue="overview">
                <TabList>
                  <TabTrigger value="overview">서비스 개요</TabTrigger>
                  <TabTrigger value="process">이용 절차</TabTrigger>
                </TabList>
                <TabPanel value="overview">
                  <p>KRDS의 폼, 안내, 탐색 요소를 조합해 일관된 공공서비스 화면을 구성할 수 있습니다.</p>
                </TabPanel>
                <TabPanel value="process">
                  <ol className="krds-info-list ordered">
                    <li>신청 내용을 입력합니다.</li>
                    <li>입력 오류를 확인하고 수정합니다.</li>
                    <li>확인 모달에서 예시 신청 결과를 확인합니다.</li>
                  </ol>
                </TabPanel>
              </Tab>
            </section>
            <section id="pg-navigation" className="pg-part" aria-labelledby="pg-navigation-title">
              <h2 id="pg-navigation-title">탐색·액션</h2>
              <p className="pg-hint">페이지를 바꾸면 아래 표의 예시 민원 내역도 바뀝니다.</p>
              <div className="pg-table">
                <Table>
                  <Table.Caption>예시 민원 처리 현황</Table.Caption>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th scope="col">민원명</Table.Th>
                      <Table.Th scope="col">신청일</Table.Th>
                      <Table.Th scope="col">상태</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {records.slice((page - 1) * 2, page * 2).map(([title, date, status]) => (
                      <Table.Tr key={title}>
                        <Table.Td>{title}</Table.Td>
                        <Table.Td>{date}</Table.Td>
                        <Table.Td>{status}</Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </div>
              <Pagination totalPages={3} currentPage={page} onChange={setPage} />
              <p role="status" className="pg-hint">
                현재 페이지: {page} / 3
              </p>
              <Button
                variant="tertiary"
                onClick={() => {
                  document.getElementById('container')?.focus()
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              >
                본문 처음으로
              </Button>
            </section>
          </div>
        </div>
      </main>
      <Footer
        logo={{ src: '/logo.svg', alt: 'KRDS React', width: 40, height: 40 }}
        address="Initializer Team · @krds.ui/react · ISC 라이선스"
        links={[
          { text: 'GitHub', href: 'https://github.com/Initializer-org/krds-react' },
          { text: 'npm 패키지', href: 'https://www.npmjs.com/package/@krds.ui/react' }
        ]}
        bottomLinks={[
          { text: 'KRDS React 문서', href: '/' },
          { text: '시작하기', href: '/guide/getting-started' }
        ]}
        copyright="© 2026 Initializer Team."
        identifierText="이 누리집은 KRDS React 예시 누리집입니다."
      />
    </div>
  )
}

import { classNames } from '@/utils'
import { forwardRef } from 'react'
import Button from '../Button'
import { Identifier } from '../Identifier'
import { FooterBottomProps, FooterLogo, FooterMainContentProps, FooterProps, FooterQuickLink } from './Footer.types'

export const FooterQuickLinks = ({ quickLinks }: { quickLinks?: FooterQuickLink[] }) => {
  if (!quickLinks || quickLinks.length === 0) return null

  return (
    <div className="foot-quick">
      <div className="inner">
        {quickLinks.map((link, index) => (
          <button key={index} type="button" className="link" title={`${link.title} 레이어`} onClick={link.onClick}>
            {link.title}
          </button>
        ))}
      </div>
    </div>
  )
}

export const FooterLogoComponent = ({ logo }: { logo?: FooterLogo }) => {
  const logoContent = logo?.src ? (
    <img
      src={logo.src}
      alt={logo.alt}
      width={logo.width}
      height={logo.height}
      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
    />
  ) : (
    <span className="sr-only">{logo?.alt || 'KRDS - Korea Design System'}</span>
  )

  const logoElement = <div className="f-logo">{logoContent}</div>

  if (logo?.href) {
    return (
      <a href={logo.href} target={logo.target} rel={logo.target === '_blank' ? 'noopener noreferrer' : undefined}>
        {logoElement}
      </a>
    )
  }

  return logoElement
}

export const FooterMainContent = ({ logo, address, contacts, links, socialLinks, defaultLinkTarget = '_self' }: FooterMainContentProps) => {
  return (
    <>
      <FooterLogoComponent logo={logo} />

      <div className="f-cnt">
        {(address || contacts) && (
          <div className="f-info">
            {address && <p className="info-addr">{address}</p>}
            {contacts && contacts.length > 0 && (
              <ul className="info-cs">
                {contacts.map((contact, index) => (
                  <li key={index}>
                    <strong className="strong">{contact.title}</strong>
                    <span className="span">{contact.description}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {(links || socialLinks) && (
          <div className="f-link">
            {links && links.length > 0 && (
              <div className="link-go">
                {links.map((link, index) => {
                  const target = link.target || defaultLinkTarget
                  const rel = link.rel || (target === '_blank' ? 'noopener noreferrer' : undefined)

                  return (
                    <Button key={index} as="a" href={link.href} target={target} rel={rel} variant="text" size="medium">
                      {link.text} <i className="svg-icon ico-angle right"></i>
                    </Button>
                  )
                })}
              </div>
            )}

            {socialLinks && socialLinks.length > 0 && (
              <div className="link-sns">
                {socialLinks.map((socialLink, index) => {
                  const target = socialLink.target || defaultLinkTarget || '_blank'
                  const rel = socialLink.rel || (target === '_blank' ? 'noopener noreferrer' : undefined)
                  const label = socialLink.label || getDefaultSocialLabel(socialLink.platform)
                  const iconClass = getDefaultSocialIconClass(socialLink.platform)

                  return (
                    <a
                      key={index}
                      href={socialLink.href}
                      target={target}
                      rel={rel}
                      className="krds-btn xlarge icon border"
                      title={target === '_blank' ? '새 창 열기' : undefined}
                    >
                      <span className="sr-only">{label}</span>
                      <i className={`svg-icon ${iconClass}`}></i>
                    </a>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}

export const FooterBottom = ({
  bottomLinks,
  copyright = '© 2023 National Health Insurance Service. All rights reserved.',
  identifierText = '이 누리집은 보건복지부 산하기관 누리집입니다.',
  identifier,
  defaultLinkTarget = '_self',
  hideIdentifier = false
}: FooterBottomProps) => {
  const finalIdentifier = identifier || { text: identifierText }

  return (
    <div className="f-btm">
      <div className="f-btm-text">
        {bottomLinks && bottomLinks.length > 0 && (
          <div className="f-menu">
            {bottomLinks.map((link, index) => {
              const target = link.target || defaultLinkTarget
              const rel = link.rel || (target === '_blank' ? 'noopener noreferrer' : undefined)

              return (
                <a key={index} href={link.href} target={target} rel={rel} className={classNames(link.isHighlighted && 'point')}>
                  {link.text}
                </a>
              )
            })}
          </div>
        )}
        <p className="f-copy">{copyright}</p>
      </div>

      {!hideIdentifier && <Identifier text={finalIdentifier.text} logoAlt={finalIdentifier.logo?.alt || 'KRDS - Korea Design System'} />}
    </div>
  )
}

const getDefaultSocialLabel = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'instagram':
      return '인스타그램'
    case 'youtube':
      return '유튜브'
    case 'x':
      return 'X'
    case 'twitter':
      return '트위터'
    case 'facebook':
      return '페이스북'
    case 'blog':
      return '블로그'
    default:
      return platform
  }
}

const getDefaultSocialIconClass = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'instagram':
      return 'ico-instagram'
    case 'youtube':
      return 'ico-youtube'
    case 'x':
    case 'twitter':
      return 'ico-sns-x'
    case 'facebook':
      return 'ico-facebook'
    case 'blog':
      return 'ico-blog'
    default:
      return ''
  }
}

/**
 * KRDS Footer Component
 * @param quickLinks 퀵 링크 목록
 * @param address 주소
 * @param contacts 연락처 목록
 * @param logo 메인 로고 설정
 * @param links 링크 목록
 * @param socialLinks 소셜 미디어 링크 목록
 * @param bottomLinks 하단 링크 목록
 * @param copyright 저작권 텍스트
 * @param identifierText 식별자 텍스트 (하위 호환성)
 * @param identifier 식별자 설정 (identifierText보다 우선)
 * @param defaultLinkTarget 모든 링크의 기본 타겟 설정
 * @param hideQuickLinks 퀵 링크 섹션 숨김 여부
 * @param hideIdentifier 식별자 섹션 숨김 여부
 */
export const Footer = forwardRef<HTMLElement, FooterProps>(
  (
    {
      quickLinks,
      address,
      contacts,
      logo,
      links,
      socialLinks,
      bottomLinks,
      copyright,
      identifierText,
      identifier,
      defaultLinkTarget,
      hideQuickLinks = false,
      hideIdentifier = false,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <footer ref={ref} id="krds-footer" className={classNames(className)} {...props}>
        {!hideQuickLinks && <FooterQuickLinks quickLinks={quickLinks} />}

        <div className="inner">
          <FooterMainContent
            logo={logo}
            address={address}
            contacts={contacts}
            links={links}
            socialLinks={socialLinks}
            defaultLinkTarget={defaultLinkTarget}
          />

          <FooterBottom
            bottomLinks={bottomLinks}
            copyright={copyright}
            identifierText={identifierText}
            identifier={identifier}
            defaultLinkTarget={defaultLinkTarget}
            hideIdentifier={hideIdentifier}
          />
        </div>
      </footer>
    )
  }
)

Footer.displayName = 'Footer'

export default Footer

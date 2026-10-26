import type { IconType } from 'react-icons';
import { FaGithub, FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';
import { SOCIALS, type SocialId } from '../lib/content';

const ICONS: Record<SocialId, IconType> = {
  github: FaGithub,
  linkedin: FaLinkedinIn,
  instagram: FaInstagram,
  x: FaXTwitter,
};

/** Social links with brand logos. `compact` shows round icon-only buttons. */
export default function SocialLinks({ compact = false }: { compact?: boolean }) {
  return (
    <ul className={compact ? 'social compact' : 'social'}>
      {SOCIALS.map((s) => {
        const Icon = ICONS[s.id];
        return (
          <li key={s.id}>
            <a href={s.href} target="_blank" rel="noopener" aria-label={`${s.label}, ${s.handle}`}>
              <Icon aria-hidden="true" />
              {!compact && (
                <span>
                  <b>{s.label}</b>
                  <i>{s.handle}</i>
                </span>
              )}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

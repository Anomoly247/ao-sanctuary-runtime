const stars = Array.from({ length: 28 }, (_, index) => index + 1);
const webLines = Array.from({ length: 8 }, (_, index) => index + 1);

export default function CosmicWeb() {
  return (
    <div className="ao-cosmic-web" aria-hidden="true">
      <div className="ao-cosmic-web-lines">
        {webLines.map((line) => <span key={`web-line-${line}`} className={`ao-cosmic-web-line ao-cosmic-web-line-${line}`} />)}
      </div>
      <div className="ao-cosmic-stars">
        {stars.map((star) => <span key={`cosmic-star-${star}`} className={`ao-cosmic-star ao-cosmic-star-${star}`} />)}
      </div>
      <span className="ao-shooting-star ao-shooting-star-one" />
      <span className="ao-shooting-star ao-shooting-star-two" />
      <span className="ao-shooting-star ao-shooting-star-three" />
    </div>
  );
}

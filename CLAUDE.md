# CLAUDE.md — Ahh Bee's Wines

## Project Overview

Static wine guide website for **ahhbeeswines.com** by Abby deVarennes. A practical, approachable wine guide for fellow TACC (military) travelers covering wine regions across California, Washington, Spain, Crete, Germany, and Portugal.

**Constraints**: No backend, no payment processing, no build step. Plain HTML/CSS/JS served from AWS S3 + CloudFront.

## Tech Stack

- **HTML/CSS/JS** — zero dependencies, no framework, no bundler
- **Google Fonts** — Playfair Display (headings) + Lato (body)
- **CSS conic-gradient** — pie charts rendered in pure CSS (no charting library)
- **Hosting** — AWS S3 + CloudFront + Route 53 + ACM

## File Structure

```
ahhbeeswines/
├── index.html          # Homepage: hero, about, region cards grid, "How will I know" section
├── california.html     # Northern California: Class 6 BX, Nugget/BevMo, specialty picks, Judgment of Paris
├── washington.html     # Washington: Class 6/BX/PX, off-base, "Why WA Wines are Cool"
├── spain.html          # Spain: Class 6 BX, less common picks, Cava explainer, Rioja explainer
├── crete.html          # Crete: Class 6 BX, off-base, winemaker revival, value explainer
├── germany.html        # Germany: Class 6 BX, off-base GG Rieslings, sweetness scale
├── portugal.html       # Portugal: Lajes Class 6, off-base, Madeira explainer, sweetness scale
├── css/
│   └── styles.css      # All styles: region color themes, tables, pie charts, responsive
├── js/
│   └── main.js         # Mobile nav toggle only (~15 lines)
└── images/             # Image assets (see TODO below)
```

## Architecture Patterns

### Region Pages
Every region page follows the same structure:
1. **Nav** — sticky, with links to Home, Regions, Quick Picks, Off-Base, Learn
2. **Region hero banner** — gradient background with region name (replaceable with image)
3. **Quick Picks table** — "If you only have time for the Class 6 BX" wines
4. **Off-base table** — specialty/local shop picks
5. **Educational content** — `.edu-block` styled sections with region-specific knowledge
6. **Pie chart** — grape distribution using CSS `conic-gradient()`
7. **Region subnav** — links to other regions with `.active` on current
8. **Footer**

### CSS Color Themes
Each region has its own color palette applied via CSS classes:
- **California**: `table-header--california` (green #5a8a2e), `--california-alt` (orange #e07b2e)
- **Washington**: `table-header--washington` (teal #2a6b7c)
- **Spain**: `table-header--spain` (red #c0392b), `--spain-alt` (dark red #8b1a1a)
- **Crete**: `table-header--crete` (teal-green #2a7c6b)
- **Germany**: `table-header--germany` (olive #5a7a3a)
- **Portugal**: `table-header--portugal` (coral #c0665a)

### Table Markup
Wine tables use this structure:
```html
<div class="wine-table-wrap">
  <table class="wine-table">
    <thead>
      <tr class="wine-table__header-row table-header--REGION">
        <th>Wine</th><th>Varietal / Region</th><th>Notes</th><th>Taste</th><th>Est. Price</th>
      </tr>
    </thead>
    <tbody>...</tbody>
  </table>
</div>
```

Varietal cells can have subtle background highlights: `varietal--red`, `varietal--yellow`, `varietal--green`, `varietal--blue`, `varietal--pink`.

### Pie Charts
Pure CSS, no JS. Pattern:
```html
<div class="pie-chart" style="background: conic-gradient(#color1 0% 25%, #color2 25% 50%, ...);"></div>
```

## AWS Infrastructure

| Resource | Value |
|----------|-------|
| **S3 bucket** | `ahhbeeswines.com` (us-east-1) |
| **CloudFront distribution** | `E3DM4SMN12PYC3` |
| **CloudFront domain** | `d1fr0wkn19xncn.cloudfront.net` |
| **ACM certificate** | `arn:aws:acm:us-east-1:625527221604:certificate/baab9072-93cf-4edb-bd17-4124a437a740` |
| **OAC ID** | `E3JX7YHRDUSACX` |
| **Route 53 hosted zone** | `Z03589381ZE5WDFBN2DBT` |
| **DNS records** | A + AAAA alias for `ahhbeeswines.com` and `www.ahhbeeswines.com` → CloudFront |

### Deploy Command

```bash
aws s3 sync ~/ahhbeeswines/ s3://ahhbeeswines.com --exclude ".git/*" --exclude ".gitignore" && aws cloudfront create-invalidation --distribution-id E3DM4SMN12PYC3 --paths "/*"
```

The `s3 sync` uploads changed files. The `create-invalidation` busts the CloudFront cache so visitors see updates immediately.

## Content Source

All wine data comes from Abby's Canva presentation exported as PDF at `~/Downloads/TDWines.pdf` (41 pages). The PDF contains:
- Wine recommendation tables organized by region
- On-base (Class 6 BX) and off-base picks
- Educational articles (Judgment of Paris, Cava, Rioja, Riesling, Madeira)
- Region maps and grape distribution pie charts
- Abby's photo and tasting notes

## TODO

- [ ] Export Abby's photo from Canva → `images/abby-photo.jpg`
- [ ] Optionally export region hero banner images from Canva (gradient placeholders work without them)
- [ ] Add favicon
- [ ] Italy page (content partially in PDF — region list and map only, no wine tables yet)
- [ ] Australia page (mentioned in PDF but no content yet)

## GitHub

**Repo**: https://github.com/jakedevar/ahhbeeswines

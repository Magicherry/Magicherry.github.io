import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * A row of tag chips that never wraps: whatever does not fit on the first line
 * collapses into a trailing "+N" chip.
 *
 * Chips past the cut stay mounted but are taken out of flow (see
 * .tag-row__measure-only) rather than unmounted, so their widths can still be
 * read on every resize without a measure-then-render round trip.
 *
 * `leading` is an optional chip pinned to the front (the project type badge);
 * it occupies space but is never collapsed.
 */
const TagRow = ({ tags, className, tagClassName, leading = null }) => {
    const containerRef = useRef(null);
    const leadingRef = useRef(null);
    const moreRef = useRef(null);
    const tagRefs = useRef([]);
    const [visibleCount, setVisibleCount] = useState(tags.length);

    const measure = useCallback(() => {
        const container = containerRef.current;
        if (!container) return;

        const available = container.clientWidth;
        // Hidden or not laid out yet - keep the current split rather than
        // collapsing everything to "+N" on a zero-width read.
        if (!available) return;

        const styles = window.getComputedStyle(container);
        const gap = parseFloat(styles.columnGap) || parseFloat(styles.gap) || 0;

        const widths = tags.map((_, index) => tagRefs.current[index]?.offsetWidth ?? 0);
        const moreWidth = moreRef.current?.offsetWidth ?? 0;

        // Under 992px the type badge is lifted out of the row and pinned to the
        // card corner, so it stops consuming space on this line.
        const leadingEl = leadingRef.current;
        const leadingInFlow = leadingEl
            ? window.getComputedStyle(leadingEl).position !== "absolute"
            : false;
        const leadingWidth = leadingInFlow ? leadingEl.offsetWidth : 0;

        let used = leadingWidth;
        let placed = leadingWidth > 0 ? 1 : 0;

        let total = used;
        let totalPlaced = placed;
        for (const width of widths) {
            total += (totalPlaced > 0 ? gap : 0) + width;
            totalPlaced += 1;
        }
        if (total <= available) {
            setVisibleCount(tags.length);
            return;
        }

        let count = 0;
        for (const width of widths) {
            const next = used + (placed > 0 ? gap : 0) + width;
            // Every stop short of the end still has to seat the "+N" chip.
            if (next + gap + moreWidth > available) break;
            used = next;
            placed += 1;
            count += 1;
        }

        setVisibleCount(count);
    }, [tags]);

    useLayoutEffect(() => {
        measure();

        const container = containerRef.current;
        if (!container || typeof ResizeObserver === "undefined") return undefined;

        const observer = new ResizeObserver(measure);
        observer.observe(container);
        return () => observer.disconnect();
    }, [measure]);

    // Chip widths shift once a webfont swaps in, which would strand a stale split.
    useEffect(() => {
        if (typeof document === "undefined" || !document.fonts?.ready) return undefined;
        let cancelled = false;
        document.fonts.ready.then(() => {
            if (!cancelled) measure();
        });
        return () => { cancelled = true; };
    }, [measure]);

    const hiddenTags = tags.slice(visibleCount);

    return (
        <div className={`tag-row ${className}`} ref={containerRef}>
            {leading ? React.cloneElement(leading, { ref: leadingRef }) : null}

            {tags.map((tag, index) => {
                const isHidden = index >= visibleCount;
                return (
                    <span
                        key={tag}
                        ref={(el) => { tagRefs.current[index] = el; }}
                        className={`${tagClassName}${isHidden ? " tag-row__measure-only" : ""}`}
                        aria-hidden={isHidden || undefined}
                    >
                        {tag}
                    </span>
                );
            })}

            <span
                ref={moreRef}
                className={`${tagClassName} tag-row__more${hiddenTags.length === 0 ? " tag-row__measure-only" : ""}`}
                title={hiddenTags.join(", ")}
                aria-hidden={hiddenTags.length === 0 || undefined}
            >
                +{hiddenTags.length || tags.length}
            </span>
        </div>
    );
};

export default TagRow;

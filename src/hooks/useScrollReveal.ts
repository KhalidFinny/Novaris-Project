import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface UseScrollRevealOptions {
    stagger?: number;
    translateY?: number | string;
    duration?: number;
    delay?: number;
}

export function useScrollReveal(options: UseScrollRevealOptions = {}) {
    const {
        // Adjust default stagger to use seconds for GSAP
        stagger = 0,
        translateY = 30,
        duration = 1,
        delay = 0,
    } = options;

    const ref = useRef<HTMLElement | HTMLDivElement | null>(null);

    useGSAP(() => {
        if (!ref.current) return;

        // Elements inside the scope with class .anime-reveal
        const elements = gsap.utils.toArray('.anime-reveal');

        // We use fromTo to ensure starting values are set immediately
        if (elements.length > 0) {
            gsap.fromTo(elements,
                { opacity: 0, y: translateY },
                {
                    opacity: 1,
                    y: 0,
                    duration,
                    delay: delay / 1000, // Converts any leftover ms delays to seconds
                    stagger: stagger > 0 ? (stagger >= 10 ? stagger / 1000 : stagger) : 0, 
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ref.current,
                        start: "top 85%",
                        toggleActions: "play none none none"
                    }
                }
            );
        } else {
            // Animate only the container itself
            gsap.fromTo(ref.current,
                { opacity: 0, y: translateY },
                {
                    opacity: 1,
                    y: 0,
                    duration,
                    delay: delay / 1000,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ref.current,
                        start: "top 85%",
                        toggleActions: "play none none none"
                    }
                }
            );
        }
    }, { scope: ref });

    return ref as any;
}

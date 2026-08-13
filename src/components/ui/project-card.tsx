"use client";

import { useRef } from "react";
import styled from "styled-components";
import { motion } from "motion/react";

const galleryBase = "https://images.giandri.my.id";

const gallery: string[] = ["1.png", "2.jpg", "3.JPG", "4.JPG", "5.JPG"];

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  pointer-events: none;
`;

const Card = styled(motion.div)`
  width: 300px;
  height: 300px;
  max-width: 100%;
  overflow-y: auto;
  scrollbar-width: none;
  pointer-events: auto;
  background: #09090b;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.25) 1px 2px 3px 0px;

  .dark & {
    background: #efebea;
    border-color: rgba(0, 0, 0, 0.25);
  }

  &::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: 640px) {
    width: 400px;
    height: 400px;
  }
`;

const TopBar = styled.nav`
  position: sticky;
  top: 0;
  z-index: 10;
  background: #09090b;
  border-bottom: 1px solid rgba(255, 255, 255, 0.25);

  .dark & {
    background: #efebea;
    border-bottom-color: rgba(0, 0, 0, 0.25);
  }
`;

const BarRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
`;

const Dots = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Dot = styled.button<{ $color: string }>`
  width: 12px;
  height: 12px;
  border: none;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  padding: 0;
  cursor: pointer;
  transition: filter 0.15s;

  &:hover {
    filter: brightness(0.9);
  }
`;

const BarTitle = styled.h1`
  flex: 1;
  text-align: center;
  font-size: 13px;
  font-weight: 500;
  line-height: 1em;
  letter-spacing: -0.01em;
  color: rgba(255, 255, 255, 0.8);

  .dark & {
    color: rgba(0, 0, 0, 0.8);
  }
`;

const Spacer = styled.div`
  width: 12px;
`;

const Body = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Cover = styled.header`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CoverImg = styled.img`
  width: 48px;
  height: 48px;
  object-fit: contain;
  border-radius: 4px;
`;

const CoverText = styled.div`
  min-width: 0;
`;

const CoverTitle = styled.h2`
  font-size: 13px;
  font-weight: 700;
  line-height: 1.2;
  color: #fff;
  margin: 0;

  .dark & {
    color: #000;
  }
`;

const CoverSubtitle = styled.p`
  font-size: 13px;
  font-weight: 500;
  line-height: 1.2;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;

  .dark & {
    color: rgba(0, 0, 0, 0.6);
  }
`;

const Grid = styled.div`
  columns: 2;
  column-gap: 8px;
  display: block;

  > * {
    margin-bottom: 8px;
  }
`;

const Photo = styled.img`
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 10px;
  display: block;
  break-inside: avoid;
`;

const PreviewLabel = styled.h3`
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;

  .dark & {
    color: rgba(0, 0, 0, 0.8);
  }
`;

export function ProjectCard({ onClose, onRaise, offsetTop = 0 }: { onClose: () => void; onRaise?: () => void; offsetTop?: number }) {
  const overlayRef = useRef<HTMLDivElement>(null);

  return (
    <Overlay ref={overlayRef} style={{ paddingTop: 16 + offsetTop }} onPointerDown={onRaise}>
      <Card
        drag
        dragMomentum={false}
        dragConstraints={overlayRef}
        dragElastic={0.1}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.6 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{ transformOrigin: "center" }}
        onClick={(e) => e.stopPropagation()}
        onPointerDown={onRaise}
      >
        <TopBar>
          <BarRow>
            <Dots>
              <Dot $color="#E06551" onClick={onClose} title="Close" />
              <Dot $color="#ECB948" as="span" />
              <Dot $color="#62BB4B" as="span" />
            </Dots>
            <BarTitle>Information about: Gallery</BarTitle>
            <Spacer />
          </BarRow>
        </TopBar>

        <Body>
          <Cover>
            <CoverImg src="https://framerusercontent.com/images/yNLcekVy7df0d4hAoz6dZR8s.png" alt="" />
            <CoverText>
              <CoverTitle>Gallery</CoverTitle>
              <CoverSubtitle>Randomly documentation</CoverSubtitle>
            </CoverText>
          </Cover>
          <PreviewLabel>Preview:</PreviewLabel>

          <Grid>
            {gallery.map((src) => (
              <Photo key={src} src={`${galleryBase}/${src}`} alt="" loading="lazy" />
            ))}
          </Grid>
        </Body>
      </Card>
    </Overlay>
  );
}

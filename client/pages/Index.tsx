import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Github, Star, Moon, Zap } from "lucide-react";

declare global {
  interface Window {
    p5: any;
  }
}

export default function Index() {
  const [username, setUsername] = useState("");
  const [isVisualizationActive, setIsVisualizationActive] = useState(false);
  const [contributionData, setContributionData] = useState<any>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const backgroundCanvasRef = useRef<HTMLDivElement>(null);
  const p5Instance = useRef<any>(null);
  const backgroundP5 = useRef<any>(null);

  // Simulated contribution data fetch
  const fetchContributionData = async (githubUsername: string) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockData = {
      totalContributions: Math.floor(Math.random() * 800) + 200,
      weeks: Array.from({ length: 52 }, (_, weekIndex) => ({
        week: weekIndex,
        days: Array.from({ length: 7 }, (_, dayIndex) => ({
          date: new Date(2024, 0, weekIndex * 7 + dayIndex + 1).toISOString().split('T')[0],
          contributionCount: Math.floor(Math.random() * 15),
          contributionLevel: Math.floor(Math.random() * 5)
        }))
      }))
    };
    
    return mockData;
  };

  // Initialize elegant starry night background
  useEffect(() => {
    if (window.p5 && backgroundCanvasRef.current) {
      const bgSketch = (p: any) => {
        let stars: any[] = [];
        let shootingStars: any[] = [];
        let planets: any[] = [];
        let time = 0;
        
        p.setup = () => {
          const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
          canvas.parent(backgroundCanvasRef.current);
          canvas.style('position', 'fixed');
          canvas.style('top', '0');
          canvas.style('left', '0');
          canvas.style('z-index', '-1');
          
          // Create realistic stars
          for (let i = 0; i < 1200; i++) {
            stars.push({
              x: p.random(p.width),
              y: p.random(p.height),
              size: p.random(0.5, 3),
              brightness: p.random(150, 255),
              twinkleSpeed: p.random(0.01, 0.03),
              color: p.random(['white', 'warm-white', 'cool-white', 'yellow']),
              layer: p.random(0.3, 1)
            });
          }
          
          // Create shooting stars
          for (let i = 0; i < 3; i++) {
            shootingStars.push({
              x: p.random(-100, p.width),
              y: p.random(0, p.height/2),
              vx: p.random(3, 8),
              vy: p.random(0.5, 2),
              length: p.random(30, 80),
              brightness: 255,
              active: p.random() > 0.8
            });
          }
          
          // Create distant planets
          planets.push({
            x: p.width * 0.8,
            y: p.height * 0.15,
            size: 40,
            color: [100, 120, 180],
            rings: true
          });
          
          planets.push({
            x: p.width * 0.15,
            y: p.height * 0.7,
            size: 25,
            color: [180, 100, 100],
            rings: false
          });
        };
        
        p.draw = () => {
          time += 0.005;
          
          // Deep space gradient background
          for (let i = 0; i <= p.height; i += 1) {
            const inter = p.map(i, 0, p.height, 0, 1);
            const nightColor = p.lerpColor(
              p.color(8, 15, 35),
              p.color(2, 5, 15),
              inter
            );
            p.stroke(nightColor);
            p.line(0, i, p.width, i);
          }
          
          // Draw realistic stars
          stars.forEach((star, index) => {
            const twinkle = p.sin(time * star.twinkleSpeed * 10 + index) * 0.3 + 0.7;
            const currentBrightness = star.brightness * twinkle * star.layer;
            
            let starColor;
            switch(star.color) {
              case 'warm-white': 
                starColor = p.color(255, 245, 220, currentBrightness); 
                break;
              case 'cool-white': 
                starColor = p.color(220, 230, 255, currentBrightness); 
                break;
              case 'yellow': 
                starColor = p.color(255, 255, 180, currentBrightness); 
                break;
              default: 
                starColor = p.color(255, 255, 255, currentBrightness);
            }
            
            p.fill(starColor);
            p.noStroke();
            
            const x = star.x + p.sin(time + index * 0.1) * star.layer * 0.5;
            const y = star.y + p.cos(time * 0.7 + index * 0.05) * star.layer * 0.3;
            
            p.ellipse(x, y, star.size * star.layer);
            
            if (star.size > 2) {
              p.fill(p.red(starColor), p.green(starColor), p.blue(starColor), currentBrightness * 0.2);
              p.ellipse(x, y, star.size * 3);
            }
          });
          
          // Draw planets
          planets.forEach(planet => {
            p.push();
            p.translate(planet.x, planet.y);
            
            p.fill(planet.color[0], planet.color[1], planet.color[2], 180);
            p.noStroke();
            p.ellipse(0, 0, planet.size);
            
            p.fill(planet.color[0], planet.color[1], planet.color[2], 30);
            p.ellipse(0, 0, planet.size * 1.5);
            
            if (planet.rings) {
              p.stroke(150, 150, 200, 100);
              p.strokeWeight(1);
              p.noFill();
              p.ellipse(0, 0, planet.size * 1.8);
              p.ellipse(0, 0, planet.size * 2.2);
            }
            
            p.pop();
          });
          
          // Draw shooting stars
          shootingStars.forEach((star, index) => {
            if (!star.active) {
              if (p.random() > 0.998) star.active = true;
              return;
            }
            
            p.stroke(255, 255, 200, star.brightness);
            p.strokeWeight(2);
            p.line(star.x, star.y, star.x - star.length, star.y - star.length/3);
            
            p.fill(255, 255, 255, star.brightness);
            p.noStroke();
            p.ellipse(star.x, star.y, 3);
            
            star.x += star.vx;
            star.y += star.vy;
            star.brightness -= 3;
            
            if (star.x > p.width + 100 || star.y > p.height + 50 || star.brightness <= 0) {
              star.x = p.random(-100, 0);
              star.y = p.random(0, p.height/3);
              star.vx = p.random(3, 8);
              star.vy = p.random(0.5, 2);
              star.brightness = 255;
              star.active = false;
            }
          });
        };
        
        p.windowResized = () => {
          p.resizeCanvas(p.windowWidth, p.windowHeight);
        };
      };
      
      backgroundP5.current = new window.p5(bgSketch);
    }
    
    return () => {
      if (backgroundP5.current) {
        backgroundP5.current.remove();
      }
    };
  }, []);

  const startVisualization = async () => {
    if (!username.trim()) return;
    
    setIsVisualizationActive(true);
    
    try {
      const data = await fetchContributionData(username);
      setContributionData(data);
      
      if (window.p5 && canvasRef.current) {
        if (p5Instance.current) {
          p5Instance.current.remove();
        }
        
        const sketch = (p: any) => {
          let stars: any[] = [];
          let contributionStars: any[] = [];
          let constellations: any[] = [];
          let time = 0;
          
          p.setup = () => {
            const canvas = p.createCanvas(
              canvasRef.current?.offsetWidth || 1000,
              700
            );
            canvas.parent(canvasRef.current);
            
            // Create beautiful starry night sky
            createRealisticStarField(p);
            createContributionStars(p, data);
            createBeautifulConstellations(p);
          };
          
          function createRealisticStarField(p: any) {
            for (let i = 0; i < 800; i++) {
              stars.push({
                x: p.random(p.width),
                y: p.random(p.height),
                size: p.random(0.3, 2.5),
                brightness: p.random(80, 255),
                twinkleSpeed: p.random(0.005, 0.02),
                layer: p.random(0.1, 1),
                starType: p.random(['white', 'blue', 'yellow', 'red', 'white', 'white'])
              });
            }
          }
          
          function createContributionStars(p: any, data: any) {
            const totalContributions = data.totalContributions;
            const highActivityDays = [];
            
            data.weeks.forEach((week: any, weekIdx: number) => {
              week.days.forEach((day: any, dayIdx: number) => {
                if (day.contributionCount > 0) {
                  highActivityDays.push({
                    intensity: day.contributionCount,
                    week: weekIdx,
                    day: dayIdx
                  });
                }
              });
            });
            
            const topDays = highActivityDays
              .sort((a, b) => b.intensity - a.intensity)
              .slice(0, Math.min(15, Math.floor(totalContributions / 20)));
            
            topDays.forEach((day, index) => {
              contributionStars.push({
                x: p.random(p.width * 0.15, p.width * 0.85),
                y: p.random(p.height * 0.15, p.height * 0.85),
                size: p.map(day.intensity, 0, 15, 4, 10),
                intensity: day.intensity,
                brightness: 255,
                type: 'contribution',
                id: index
              });
            });
          }
          
          function createBeautifulConstellations(p: any) {
            if (contributionStars.length >= 5) {
              createMajorConstellation(p);
            }
            if (contributionStars.length >= 8) {
              createSecondConstellation(p);
            }
            if (contributionStars.length >= 3) {
              createGentleConnections(p);
            }
          }
          
          function createMajorConstellation(p: any) {
            const mainStars = contributionStars
              .sort((a, b) => b.intensity - a.intensity)
              .slice(0, 5);
            
            // Create a beautiful flowing pattern
            for (let i = 0; i < mainStars.length - 1; i++) {
              const current = mainStars[i];
              const next = mainStars[i + 1];
              const distance = p.dist(current.x, current.y, next.x, next.y);
              
              if (distance < p.width * 0.4) {
                constellations.push({
                  start: current.id,
                  end: next.id,
                  type: 'major',
                  name: `${username} Major`
                });
              }
            }
          }
          
          function createSecondConstellation(p: any) {
            const secondaryStars = contributionStars
              .filter(s => !s.used)
              .sort((a, b) => b.intensity - a.intensity)
              .slice(0, 4);
            
            secondaryStars.forEach(s => s.used = true);
            
            if (secondaryStars.length >= 3) {
              // Create triangular pattern
              for (let i = 0; i < secondaryStars.length; i++) {
                const next = (i + 1) % secondaryStars.length;
                constellations.push({
                  start: secondaryStars[i].id,
                  end: secondaryStars[next].id,
                  type: 'secondary',
                  name: `${username} Minor`
                });
              }
            }
          }
          
          function createGentleConnections(p: any) {
            const remainingStars = contributionStars.filter(s => !s.used);
            
            for (let i = 0; i < remainingStars.length - 1; i++) {
              const current = remainingStars[i];
              const next = remainingStars[i + 1];
              const distance = p.dist(current.x, current.y, next.x, next.y);
              
              if (distance < 150 && p.random() > 0.6) {
                constellations.push({
                  start: current.id,
                  end: next.id,
                  type: 'gentle',
                  name: 'Star Flow'
                });
              }
            }
          }
          
          p.draw = () => {
            time += 0.008;
            
            // Beautiful deep night sky
            for (let i = 0; i <= p.height; i++) {
              const inter = p.map(i, 0, p.height, 0, 1);
              const nightColor = p.lerpColor(
                p.color(8, 15, 35),
                p.color(2, 5, 15),
                inter
              );
              p.stroke(nightColor);
              p.line(0, i, p.width, i);
            }
            
            // Draw background stars
            stars.forEach((star, index) => {
              const twinkle = p.sin(time * star.twinkleSpeed * 10 + index) * 0.4 + 0.6;
              const brightness = star.brightness * twinkle * star.layer;
              
              let starColor;
              switch(star.starType) {
                case 'blue': starColor = p.color(200, 230, 255, brightness); break;
                case 'yellow': starColor = p.color(255, 255, 200, brightness); break;
                case 'red': starColor = p.color(255, 200, 180, brightness); break;
                default: starColor = p.color(255, 255, 255, brightness);
              }
              
              p.fill(starColor);
              p.noStroke();
              p.ellipse(star.x, star.y, star.size * star.layer);
            });
            
            // Draw elegant constellation lines
            constellations.forEach(constellation => {
              const start = contributionStars.find(star => star.id === constellation.start);
              const end = contributionStars.find(star => star.id === constellation.end);
              
              if (start && end) {
                const alpha = 100 + p.sin(time * 1.5 + constellation.start * 0.3) * 40;
                const color = getConstellationColor(constellation.type);
                
                p.stroke(color.r, color.g, color.b, alpha);
                p.strokeWeight(1.2);
                p.line(start.x, start.y, end.x, end.y);
              }
            });
            
            // Draw special contribution stars
            contributionStars.forEach((star) => {
              const pulse = p.sin(time * 3 + star.id * 0.8) * 0.3 + 0.7;
              const size = star.size * pulse;
              
              // Golden contribution star
              p.fill(255, 220, 120, 255);
              p.noStroke();
              p.ellipse(star.x, star.y, size);
              
              // Warm glow
              p.fill(255, 180, 80, 80);
              p.ellipse(star.x, star.y, size * 2);
              
              // Bright aura for high contributions
              if (star.intensity > 8) {
                p.fill(255, 200, 100, 40);
                p.ellipse(star.x, star.y, size * 3.5);
              }
            });
            
            function getConstellationColor(type: string) {
              switch(type) {
                case 'major': return { r: 150, g: 200, b: 255 };
                case 'secondary': return { r: 255, g: 200, b: 150 };
                case 'gentle': return { r: 200, g: 180, b: 255 };
                default: return { r: 180, g: 180, b: 255 };
              }
            }
          };
          
          p.windowResized = () => {
            p.resizeCanvas(
              canvasRef.current?.offsetWidth || 1000,
              700
            );
          };
        };
        
        p5Instance.current = new window.p5(sketch);
      }
    } catch (error) {
      console.error("Error fetching contribution data:", error);
    }
  };

  const resetVisualization = () => {
    setIsVisualizationActive(false);
    setContributionData(null);
    if (p5Instance.current) {
      p5Instance.current.remove();
      p5Instance.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (p5Instance.current) {
        p5Instance.current.remove();
      }
      if (backgroundP5.current) {
        backgroundP5.current.remove();
      }
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Starry Night Background Canvas */}
      <div ref={backgroundCanvasRef} className="fixed inset-0 z-0" />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Elegant Floating Header */}
        <header className="backdrop-blur-sm border-b border-white/10 py-12">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-center space-x-6 mb-6">
              <Github className="w-8 h-8 text-blue-200 opacity-80" />
              <Star className="w-6 h-6 text-yellow-200 opacity-60" />
              <Moon className="w-7 h-7 text-slate-300 opacity-70" />
            </div>
            <h1 className="text-6xl font-light text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-blue-200 to-slate-300 text-center tracking-wider">
              GitHub Starry Night
            </h1>
            <p className="text-center text-slate-300/80 mt-6 text-xl font-light tracking-wide">
              Transform your contributions into celestial constellations
            </p>
          </div>
        </header>

        <main className="container mx-auto px-6 py-16">
          {!isVisualizationActive ? (
            /* Ethereal Input Section */
            <div className="max-w-md mx-auto">
              <Card className="backdrop-blur-xl bg-black/20 border border-slate-400/20 shadow-2xl shadow-black/50 hover:shadow-blue-500/10 transition-all duration-700 floating-card">
                <CardHeader className="text-center pb-8">
                  <CardTitle className="flex items-center justify-center space-x-4 text-xl font-light">
                    <Github className="w-5 h-5 text-slate-300" />
                    <span className="text-slate-200 tracking-wide">
                      Enter GitHub Username
                    </span>
                  </CardTitle>
                  <CardDescription className="text-slate-400 text-base font-light mt-4">
                    Discover the constellation patterns hidden in your code contributions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 px-8 pb-8">
                  <div className="space-y-4">
                    <Label htmlFor="username" className="text-slate-300 font-light tracking-wide">
                      GitHub Username
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="octocat"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="bg-black/30 border-slate-500/30 text-slate-100 placeholder:text-slate-500 focus:border-blue-400/50 focus:ring-blue-400/20 transition-all duration-300 font-light"
                      onKeyPress={(e) => e.key === 'Enter' && startVisualization()}
                    />
                  </div>
                  <Button 
                    onClick={startVisualization}
                    disabled={!username.trim()}
                    className="w-full bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-slate-100 text-base py-6 transition-all duration-500 hover:scale-105 shadow-lg shadow-black/30 font-light tracking-wide"
                  >
                    Generate Constellation Map
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Elegant Visualization Section */
            <div className="space-y-10">
              <div className="flex items-center justify-between backdrop-blur-sm bg-black/10 rounded-xl p-8 border border-slate-400/20">
                <div>
                  <h2 className="text-3xl font-light text-slate-200 tracking-wide">
                    {username}'s Contribution Constellation
                  </h2>
                  {contributionData && (
                    <p className="text-slate-400 text-lg mt-2 font-light">
                      {contributionData.totalContributions} contributions mapped across the celestial sphere
                    </p>
                  )}
                </div>
                <Button
                  onClick={resetVisualization}
                  variant="outline"
                  className="border-slate-500/40 hover:bg-slate-700/30 text-slate-300 font-light"
                >
                  New Constellation
                </Button>
              </div>
              
              <Card className="backdrop-blur-sm bg-black/10 border-slate-400/20 overflow-hidden shadow-2xl">
                <CardContent className="p-0">
                  <div 
                    ref={canvasRef}
                    className="w-full relative"
                    style={{ minHeight: '700px' }}
                  />
                </CardContent>
              </Card>
              
              {contributionData && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <Card className="backdrop-blur-sm bg-black/15 border-slate-400/20 hover:scale-105 transition-all duration-500">
                    <CardContent className="p-8">
                      <div className="flex items-center space-x-3 mb-3">
                        <Star className="w-5 h-5 text-yellow-300" />
                        <span className="text-slate-300 font-light">Total Stars</span>
                      </div>
                      <p className="text-3xl font-light text-slate-100">
                        {contributionData.totalContributions}
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="backdrop-blur-sm bg-black/15 border-slate-400/20 hover:scale-105 transition-all duration-500">
                    <CardContent className="p-8">
                      <div className="flex items-center space-x-3 mb-3">
                        <Zap className="w-5 h-5 text-blue-300" />
                        <span className="text-slate-300 font-light">Bright Stars</span>
                      </div>
                      <p className="text-3xl font-light text-slate-100">
                        {contributionData.weeks.reduce((acc: number, week: any) => 
                          acc + week.days.filter((day: any) => day.contributionCount > 8).length, 0
                        )}
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="backdrop-blur-sm bg-black/15 border-slate-400/20 hover:scale-105 transition-all duration-500">
                    <CardContent className="p-8">
                      <div className="flex items-center space-x-3 mb-3">
                        <Moon className="w-5 h-5 text-slate-300" />
                        <span className="text-slate-300 font-light">Active Days</span>
                      </div>
                      <p className="text-3xl font-light text-slate-100">
                        {contributionData.weeks.reduce((acc: number, week: any) => 
                          acc + week.days.filter((day: any) => day.contributionCount > 0).length, 0
                        )}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}
        </main>
        
        {/* Minimalist Footer */}
        <footer className="backdrop-blur-sm border-t border-slate-400/20 mt-24 py-8">
          <div className="container mx-auto px-6 text-center">
            <p className="text-slate-400 text-sm font-light tracking-wide">
              Built for astronomical discovery • Powered by p5.js and GitHub API
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

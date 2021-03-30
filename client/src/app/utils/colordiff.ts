import { Color } from '@app/classes/color';

export class ColorDiff {
    compare(color1: Color, color2: Color): number {
        let Lab1 = this.rgb2Lab(color1);
        let Lab2 = this.rgb2Lab(color2);
        const L1 = Lab1.L;
        const a1 = Lab1.a;
        const b1 = Lab1.b;
        const L2 = Lab2.L;
        const a2 = Lab2.a;
        const b2 = Lab2.b;
        const C1 = Math.sqrt(Math.pow(a1, 2) + Math.pow(b1, 2));
        const C2 = Math.sqrt(Math.pow(a2, 2) + Math.pow(b2, 2));

        let diff_alt_L = L1 - L2;
        // let avg_L = (L1 + L2) / 2;
        let avg_C = (C1 + C2) / 2;

        let alt_a1 = a1 + (a1 / 2) * (1 - Math.sqrt(Math.pow(avg_C, 7) / (Math.pow(avg_C, 7) + Math.pow(25, 7))));
        let alt_a2 = a2 + (a2 / 2) * (1 - Math.sqrt(Math.pow(avg_C, 7) / (Math.pow(avg_C, 7) + Math.pow(25, 7))));

        let alt_C1 = Math.sqrt(Math.pow(alt_a1, 2) + Math.pow(b1, 2));
        let alt_C2 = Math.sqrt(Math.pow(alt_a2, 2) + Math.pow(b2, 2));

        let avg_alt_C = (alt_C1 + alt_C2) / 2;
        let diff_alt_C = alt_C2 - alt_C1;

        let alt_h1 = this.toDeg(Math.atan2(b1, alt_a1)) % 360;
        let alt_h2 = this.toDeg(Math.atan2(b2, alt_a2)) % 360;

        if (alt_h1 < 0) {
            alt_h1 += 360;
        }
        if (alt_h2 < 0) {
            alt_h2 += 360;
        }

        let diff_alt_h = 0;

        if (!alt_C1 || !alt_C2) {
            diff_alt_h = 0;
        } else if (alt_h1 - alt_h2 <= 180) {
            diff_alt_h = alt_h2 - alt_h1;
        } else if (alt_h1 - alt_h2 > 180 && alt_h2 <= alt_h1) {
            diff_alt_h = alt_h2 - alt_h1 + 360;
        } else if (alt_h1 - alt_h2 > 180 && alt_h2 > alt_h1) {
            diff_alt_h = alt_h2 - alt_h1 - 360;
        }

        let diff_alt_H = 2 * Math.sqrt(alt_C1 * alt_C2) * Math.sin(this.toRad(diff_alt_h / 2));

        let avg_alt_H = 0;

        if (alt_h1 - alt_h2 > 180) {
            avg_alt_H = (alt_h1 + alt_h2 + 360) / 2;
        } else if (alt_h1 - alt_h2 <= 180) {
            avg_alt_H = (alt_h1 + alt_h2) / 2;
        }

        const T =
            1 -
            0.17 * Math.cos(this.toRad(avg_alt_H - 30)) +
            0.24 * Math.cos(this.toRad(2 * avg_alt_H)) +
            0.32 * Math.cos(this.toRad(3 * avg_alt_H + 6)) -
            0.2 * Math.cos(this.toRad(4 * avg_alt_H - 63));

        const SL = 1 + (0.015 * Math.pow(diff_alt_L - 50, 2)) / Math.sqrt(20 + Math.pow(diff_alt_L - 50, 2));
        const SC = 1 + 0.045 * avg_alt_C;
        const SH = 1 + 0.015 * avg_alt_C * T;

        const RT =
            -2 *
            Math.sqrt(Math.pow(avg_alt_C, 7) / (Math.pow(avg_alt_C, 7) + Math.pow(24, 7))) *
            Math.sin(this.toRad(60 * Math.exp(-1 * Math.pow((avg_alt_H - 275) / 25, 2))));

        const KL = 1;
        const KC = 1;
        const KH = 1;

        return Math.sqrt(
            Math.pow(diff_alt_L / (KL * SL), 2) +
                Math.pow(diff_alt_C / (KC * SC), 2) +
                Math.pow(diff_alt_H / (KH * SH), 2) +
                RT * (diff_alt_C / (KC * SC)) * (diff_alt_H / (KH * SH)),
        );
    }

    toDeg(rad: number): number {
        return (rad * 180) / Math.PI;
    }

    toRad(deg: number): number {
        return (deg * Math.PI) / 180;
    }

    rgb2Lab(rgb: Color): { L: number; a: number; b: number } {
        for (const key in rgb) {
            if (Object.prototype.hasOwnProperty.call(rgb, key)) {
                rgb[key as keyof Color] = rgb[key as keyof Color] / 255;

                if (rgb[key as keyof Color] > 0.04045) {
                    rgb[key as keyof Color] = Math.pow((rgb[key as keyof Color] + 0.055) / 1.055, 2.4);
                } else {
                    rgb[key as keyof Color] = rgb[key as keyof Color] / 12.92;
                }

                rgb[key as keyof Color] = rgb[key as keyof Color] * 100;
            }
        }

        const x = rgb.R * 0.4124 + rgb.G * 0.3576 + rgb.B * 0.1805;
        const y = rgb.R * 0.2126 + rgb.G * 0.7152 + rgb.B * 0.0722;
        const z = rgb.R * 0.0193 + rgb.G * 0.1192 + rgb.B * 0.9505;

        interface XYZ {
            x: number;
            y: number;
            z: number;
        }
        const xyz: XYZ = { x, y, z };

        xyz.x = xyz.x / 95.047;
        xyz.y = xyz.y / 100;
        xyz.z = xyz.z / 108.883;

        for (const key in xyz) {
            if (xyz[key as keyof XYZ] > 0.008856) {
                xyz[key as keyof XYZ] = Math.pow(xyz[key as keyof XYZ], 1 / 3);
            } else {
                xyz[key as keyof XYZ] = 7.787 * xyz[key as keyof XYZ] + 16 / 116;
            }
        }

        const L = 116 * xyz.y - 16;
        const a = 500 * (xyz.x - xyz.y);
        const b = 200 * (xyz.y - xyz.z);

        return { L, a, b };
    }
}

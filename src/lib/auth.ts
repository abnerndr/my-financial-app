import { prisma } from "@/lib/prisma";
import { normalizePhone, verifyStoredOtp, type OtpChannel } from "@/lib/otp";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const googleConfigured = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma),
	providers: [
		...(googleConfigured
			? [
					GoogleProvider({
						clientId: process.env.GOOGLE_CLIENT_ID!,
						clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
						allowDangerousEmailAccountLinking: true,
					}),
				]
			: []),
		CredentialsProvider({
			id: "otp",
			name: "OTP",
			credentials: {
				channel: { label: "Canal", type: "text" },
				destination: { label: "Destino", type: "text" },
				code: { label: "Código", type: "text" },
			},
			async authorize(credentials) {
				const channel = credentials?.channel as OtpChannel | undefined;
				const destinationRaw = credentials?.destination?.trim() ?? "";
				const code = credentials?.code?.trim() ?? "";

				if (!channel || !destinationRaw || !code) {
					throw new Error("Informe canal, destino e código");
				}
				if (channel !== "email" && channel !== "whatsapp") {
					throw new Error("Canal inválido");
				}

				const destination =
					channel === "email" ? destinationRaw.toLowerCase() : normalizePhone(destinationRaw);

				const ok = await verifyStoredOtp(channel, destination, code);
				if (!ok) throw new Error("Código inválido ou expirado");

				if (channel === "email") {
					let user = await prisma.user.findUnique({ where: { email: destination } });
					if (!user) {
						user = await prisma.user.create({
							data: {
								email: destination,
								emailVerified: new Date(),
								name: destination.split("@")[0] ?? null,
							},
						});
						await prisma.userSettings.create({ data: { userId: user.id } });
					} else if (!user.emailVerified) {
						user = await prisma.user.update({
							where: { id: user.id },
							data: { emailVerified: new Date() },
						});
					}
					return { id: user.id, email: user.email, name: user.name, image: user.image };
				}

				// WhatsApp
				let user = await prisma.user.findFirst({
					where: { OR: [{ phone: destination }, { settings: { phone: destination } }] },
				});
				if (!user) {
					const syntheticEmail = `wa_${destination.replace(/\D/g, "")}@whatsapp.local`;
					user = await prisma.user.create({
						data: {
							email: syntheticEmail,
							phone: destination,
							phoneVerified: new Date(),
							emailVerified: new Date(),
							name: destination,
							settings: {
								create: { phone: destination, phoneVerified: true },
							},
						},
					});
				} else {
					await prisma.user.update({
						where: { id: user.id },
						data: { phone: user.phone ?? destination, phoneVerified: new Date() },
					});
					await prisma.userSettings.upsert({
						where: { userId: user.id },
						create: { userId: user.id, phone: destination, phoneVerified: true },
						update: { phone: destination, phoneVerified: true },
					});
				}
				return { id: user.id, email: user.email, name: user.name, image: user.image };
			},
		}),
		CredentialsProvider({
			id: "credentials",
			name: "credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Senha", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					throw new Error("Email e senha são obrigatórios");
				}

				const user = await prisma.user.findUnique({
					where: { email: credentials.email },
				});

				if (!user || !user.password) {
					throw new Error("Credenciais inválidas");
				}

				if (!user.emailVerified) {
					throw new Error("Email não verificado. Verifique sua caixa de entrada.");
				}

				const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
				if (!isPasswordValid) {
					throw new Error("Credenciais inválidas");
				}

				return {
					id: user.id,
					email: user.email,
					name: user.name,
					image: user.image,
				};
			},
		}),
	],
	callbacks: {
		async jwt({ token, user, account }) {
			if (user) {
				token.id = user.id;
			}
			if (account?.provider === "google" && user?.email) {
				const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
				if (dbUser) token.id = dbUser.id;
			}
			return token;
		},
		async session({ session, token }) {
			if (session?.user) {
				(session.user as { id: string }).id = token.id as string;
			}
			return session;
		},
	},
	session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
	pages: {
		signIn: "/login",
		signOut: "/signout",
	},
};

export async function getSession() {
	return getServerSession(authOptions);
}

export function isGoogleAuthEnabled() {
	return googleConfigured;
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession, comparePassword, hashPassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Debe proporcionar la contraseña actual y la nueva contraseña' },
        { status: 400 }
      );
    }

    const user = (await prisma.user.findUnique({
      where: { id: session.userId },
    })) || (await prisma.user.findUnique({
      where: { email: session.email },
    })) || (await prisma.user.findFirst());

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    const isMatch = await comparePassword(currentPassword, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'La contraseña actual es incorrecta' },
        { status: 400 }
      );
    }

    const newPasswordHash = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newPasswordHash },
    });

    return NextResponse.json(
      { success: true, message: 'Contraseña actualizada correctamente' },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Error al cambiar la contraseña' },
      { status: 500 }
    );
  }
}

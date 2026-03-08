package com.br.tutoria.pei.fran.projections;

public interface UserDetailsProjection {
    String getUsername();
    String getCpf();
    Long getRoleId();
    String getAuthority();
}

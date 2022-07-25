cf login --sso
mbt build -s '/home/user/projects/PM030.APP4'; sleep 2;
cf deploy "/home/user/projects/PM030.APP4/mta_archives/APP4_0.0.1.mtar"
